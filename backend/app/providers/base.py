"""
Payment provider abstraction.
Concrete providers implement this interface.
"""

from abc import ABC, abstractmethod
from typing import Optional
from dataclasses import dataclass


@dataclass
class PaymentResult:
    provider_ref: str
    status: str  # "pending", "success", "failed"
    redirect_url: Optional[str] = None
    raw_payload: Optional[dict] = None


class PaymentProvider(ABC):
    @abstractmethod
    async def initiate(self, order_id: str, amount: float, currency: str = "ZAR") -> PaymentResult:
        """Start a payment and return a result with provider reference."""
        ...

    @abstractmethod
    async def verify_webhook(self, payload: bytes, signature: str) -> dict:
        """Verify and parse an incoming webhook. Raises on invalid signature."""
        ...

    @abstractmethod
    async def get_status(self, provider_ref: str) -> str:
        """Query payment status from provider."""
        ...
