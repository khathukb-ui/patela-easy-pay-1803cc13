import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.cart import Cart, CartStatus
from app.models.order import Order, OrderItem, OrderStatus
from app.schemas.order import OrderResponse
from app.services.ims_adapter import get_stock_availability, push_order_to_ims
from app.utils.security import get_current_user
from pydantic import BaseModel

router = APIRouter()


class CheckoutRequest(BaseModel):
    cart_id: str
    delivery_fee: float = 0


@router.post("", response_model=OrderResponse, status_code=201)
async def checkout(body: CheckoutRequest, db: Session = Depends(get_db), _=Depends(get_current_user)):
    cart = db.query(Cart).filter(Cart.id == body.cart_id, Cart.status == CartStatus.active).first()
    if not cart or not cart.items:
        raise HTTPException(400, "Cart is empty or not found")

    # Validate stock with IMS for each item
    for item in cart.items:
        try:
            avail = await get_stock_availability(item.sku)
            if avail.available_qty < item.qty:
                raise HTTPException(409, f"Insufficient stock for {item.item_name_snapshot} (available: {avail.available_qty})")
        except HTTPException:
            raise
        except Exception:
            raise HTTPException(502, f"Cannot verify stock for {item.sku}")

    # Create order with snapshots
    order_no = f"PAT-{uuid.uuid4().hex[:8].upper()}"
    subtotal = sum(float(i.line_total) for i in cart.items)
    total = subtotal + body.delivery_fee

    order = Order(
        order_no=order_no,
        customer_id=cart.customer_id,
        status=OrderStatus.pending_payment,
        subtotal=subtotal,
        delivery_fee=body.delivery_fee,
        total=total,
    )
    db.add(order)
    db.flush()

    for ci in cart.items:
        oi = OrderItem(
            order_id=order.id,
            sku=ci.sku,
            item_name_snapshot=ci.item_name_snapshot,
            unit_price_snapshot=ci.unit_price_snapshot,
            qty=ci.qty,
            line_total=ci.line_total,
        )
        db.add(oi)

    # Push order to IMS
    try:
        ims_ref = await push_order_to_ims({
            "order_no": order_no,
            "items": [{"sku": ci.sku, "qty": ci.qty, "price": float(ci.unit_price_snapshot)} for ci in cart.items],
            "total": total,
        })
        order.ims_order_ref = ims_ref
    except Exception:
        # Order still created locally; IMS sync can retry
        pass

    # Mark cart as converted
    cart.status = CartStatus.converted
    db.commit()
    db.refresh(order)

    return order
