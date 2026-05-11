from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class InitiatePaymentRequest(BaseModel):
    order_id: str
    provider: Optional[str] = None


class PaymentResponse(BaseModel):
    id: str
    order_id: str
    provider: str
    provider_ref: Optional[str]
    amount: float
    status: str
    initiated_at: datetime
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True
