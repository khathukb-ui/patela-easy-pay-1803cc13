from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.order import Order, OrderStatus
from app.models.payment import Payment, PaymentStatus
from app.models.webhook import Webhook
from app.schemas.payment import InitiatePaymentRequest, PaymentResponse
from app.providers.stub import StubProvider
from app.services.ims_adapter import push_payment_confirmation
from app.utils.security import get_current_user
from app.config import settings

router = APIRouter()


def _get_provider():
    # Extend with real providers: if settings.PAYMENT_PROVIDER == "paystack": ...
    return StubProvider()


@router.post("/initiate", response_model=PaymentResponse, status_code=201)
async def initiate_payment(body: InitiatePaymentRequest, db: Session = Depends(get_db), _=Depends(get_current_user)):
    order = db.query(Order).filter(Order.id == body.order_id).first()
    if not order:
        raise HTTPException(404, "Order not found")
    if order.status not in (OrderStatus.pending_payment, OrderStatus.failed):
        raise HTTPException(400, f"Order status '{order.status.value}' cannot accept payment")

    provider = _get_provider()
    result = await provider.initiate(order.id, float(order.total))

    payment = Payment(
        order_id=order.id,
        provider=settings.PAYMENT_PROVIDER,
        provider_ref=result.provider_ref,
        amount=float(order.total),
        status=PaymentStatus(result.status) if result.status in PaymentStatus.__members__ else PaymentStatus.pending,
        raw_payload_json=result.raw_payload,
    )

    if payment.status == PaymentStatus.success:
        payment.completed_at = datetime.utcnow()
        order.status = OrderStatus.paid
        # Push confirmation to IMS
        if order.ims_order_ref:
            await push_payment_confirmation(order.ims_order_ref, result.provider_ref, float(order.total))

    db.add(payment)
    db.commit()
    db.refresh(payment)
    return payment


@router.post("/webhook/{provider}")
async def payment_webhook(provider: str, request: Request, db: Session = Depends(get_db)):
    body = await request.body()
    signature = request.headers.get("x-webhook-signature", "")

    # Log raw webhook
    webhook = Webhook(
        provider=provider,
        event_type="payment",
        payload_json={"raw": body.decode("utf-8", errors="replace")},
    )
    db.add(webhook)

    try:
        prov = _get_provider()
        data = await prov.verify_webhook(body, signature)
        webhook.provider_ref = data.get("reference")
        webhook.processed = True

        # Update payment + order
        payment = db.query(Payment).filter(Payment.provider_ref == data.get("reference")).first()
        if payment:
            new_status = data.get("status", "success")
            payment.status = PaymentStatus(new_status)
            payment.completed_at = datetime.utcnow()

            if new_status == "success":
                payment.order.status = OrderStatus.paid
                if payment.order.ims_order_ref:
                    await push_payment_confirmation(
                        payment.order.ims_order_ref, payment.provider_ref, float(payment.amount)
                    )
            elif new_status == "failed":
                payment.order.status = OrderStatus.failed
    except Exception:
        webhook.processed = False

    db.commit()
    return {"received": True}


@router.get("/{order_id}", response_model=PaymentResponse)
def get_payment(order_id: str, db: Session = Depends(get_db), _=Depends(get_current_user)):
    payment = db.query(Payment).filter(Payment.order_id == order_id).order_by(Payment.initiated_at.desc()).first()
    if not payment:
        raise HTTPException(404, "No payment found for this order")
    return payment
