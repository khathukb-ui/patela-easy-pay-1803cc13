"""
Stub payment provider for development/testing.
Returns immediate success — NOT for production.
"""

import uuid
from app.providers.base import PaymentProvider, PaymentResult


class StubProvider(PaymentProvider):
    async def initiate(self, order_id: str, amount: float, currency: str = "ZAR") -> PaymentResult:
        return PaymentResult(
            provider_ref=f"STUB-{uuid.uuid4().hex[:12].upper()}",
            status="success",
            raw_payload={"order_id": order_id, "amount": amount, "currency": currency},
        )

    async def verify_webhook(self, payload: bytes, signature: str) -> dict:
        raise NotImplementedError("Stub provider does not support webhooks")

    async def get_status(self, provider_ref: str) -> str:
        return "success"
