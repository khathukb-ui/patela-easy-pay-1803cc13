from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.cart import Cart, CartItem, CartStatus
from app.schemas.cart import (
    CreateCartRequest, AddCartItemRequest, UpdateCartItemRequest,
    CartResponse, CartItemResponse,
)
from app.services.ims_adapter import get_catalog_items
from app.utils.security import get_current_user

router = APIRouter()


@router.post("", response_model=CartResponse, status_code=201)
async def create_cart(body: CreateCartRequest, db: Session = Depends(get_db), _=Depends(get_current_user)):
    cart = Cart(customer_id=body.customer_id)
    db.add(cart)
    db.commit()
    db.refresh(cart)
    return _cart_response(cart)


@router.get("/{cart_id}", response_model=CartResponse)
async def get_cart(cart_id: str, db: Session = Depends(get_db), _=Depends(get_current_user)):
    cart = db.query(Cart).filter(Cart.id == cart_id).first()
    if not cart:
        raise HTTPException(404, "Cart not found")
    return _cart_response(cart)


@router.post("/{cart_id}/items", response_model=CartItemResponse, status_code=201)
async def add_item(cart_id: str, body: AddCartItemRequest, db: Session = Depends(get_db), _=Depends(get_current_user)):
    cart = db.query(Cart).filter(Cart.id == cart_id, Cart.status == CartStatus.active).first()
    if not cart:
        raise HTTPException(404, "Active cart not found")

    # Fetch item details from IMS
    catalog = await get_catalog_items()
    ims_item = next((i for i in catalog if i.sku == body.sku), None)
    if not ims_item:
        raise HTTPException(404, "Item not found in IMS catalog")
    if not ims_item.in_stock or ims_item.available_qty < body.qty:
        raise HTTPException(409, "Insufficient stock")

    item = CartItem(
        cart_id=cart_id,
        sku=body.sku,
        item_name_snapshot=ims_item.name,
        unit_price_snapshot=ims_item.price,
        qty=body.qty,
        line_total=round(ims_item.price * body.qty, 2),
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.patch("/{cart_id}/items/{item_id}", response_model=CartItemResponse)
async def update_item(cart_id: str, item_id: str, body: UpdateCartItemRequest, db: Session = Depends(get_db), _=Depends(get_current_user)):
    item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.cart_id == cart_id).first()
    if not item:
        raise HTTPException(404, "Cart item not found")

    if body.qty == 0:
        db.delete(item)
        db.commit()
        raise HTTPException(204)

    item.qty = body.qty
    item.line_total = round(float(item.unit_price_snapshot) * body.qty, 2)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{cart_id}/items/{item_id}", status_code=204)
async def remove_item(cart_id: str, item_id: str, db: Session = Depends(get_db), _=Depends(get_current_user)):
    item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.cart_id == cart_id).first()
    if not item:
        raise HTTPException(404, "Cart item not found")
    db.delete(item)
    db.commit()


def _cart_response(cart: Cart) -> CartResponse:
    items = [CartItemResponse.model_validate(i) for i in cart.items]
    total = sum(i.line_total for i in items)
    return CartResponse(id=cart.id, customer_id=cart.customer_id, status=cart.status.value, items=items, total=total)
