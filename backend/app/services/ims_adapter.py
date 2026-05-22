"""
IMS Integration Adapter

IMS is the source of truth for items, stock, and pricing.
Patela reads from IMS and pushes orders/payment confirmations back.
"""

import httpx
import structlog
from typing import List, Optional
from datetime import datetime

from app.config import settings
from app.schemas.catalog import CatalogItemResponse, StockAvailabilityResponse

logger = structlog.get_logger()

_client: Optional[httpx.AsyncClient] = None


def _get_client() -> httpx.AsyncClient:
    global _client
    if _client is None:
        _client = httpx.AsyncClient(
            base_url=settings.IMS_BASE_URL,
            headers={
                "Authorization": f"Bearer {settings.IMS_API_KEY}",
                "Content-Type": "application/json",
            },
            timeout=15.0,
        )
    return _client


async def get_catalog_items() -> List[CatalogItemResponse]:
    """Fetch full item catalog from IMS."""
    client = _get_client()
    try:
        resp = await client.get("/api/items")
        resp.raise_for_status()
        data = resp.json()
        return [
            CatalogItemResponse(
                sku=item["sku"],
                name=item["name"],
                price=item["price"],
                category=item.get("category"),
                image_url=item.get("image_url"),
                in_stock=item.get("available_qty", 0) > 0,
                available_qty=item.get("available_qty", 0),
            )
            for item in data.get("items", data if isinstance(data, list) else [])
        ]
    except httpx.HTTPError as e:
        logger.error("ims_catalog_fetch_failed", error=str(e))
        raise


async def get_stock_availability(sku: str) -> StockAvailabilityResponse:
    """Check real-time stock for a specific SKU."""
    client = _get_client()
    try:
        resp = await client.get(f"/api/items/{sku}/availability")
        resp.raise_for_status()
        data = resp.json()
        return StockAvailabilityResponse(
            sku=sku,
            available_qty=data.get("available_qty", 0),
            in_stock=data.get("available_qty", 0) > 0,
        )
    except httpx.HTTPError as e:
        logger.error("ims_stock_check_failed", sku=sku, error=str(e))
        raise


async def push_order_to_ims(order_data: dict) -> str:
    """Create order in IMS. Returns IMS order reference."""
    client = _get_client()
    try:
        resp = await client.post("/api/orders", json=order_data)
        resp.raise_for_status()
        data = resp.json()
        ims_ref = data.get("order_ref", data.get("id", ""))
        logger.info("ims_order_created", ims_ref=ims_ref)
        return str(ims_ref)
    except httpx.HTTPError as e:
        logger.error("ims_order_push_failed", error=str(e))
        raise


async def push_payment_confirmation(ims_order_ref: str, payment_ref: str, amount: float) -> bool:
    """Confirm payment to IMS."""
    client = _get_client()
    try:
        resp = await client.post(
            f"/api/orders/{ims_order_ref}/payment",
            json={"payment_ref": payment_ref, "amount": amount, "confirmed_at": datetime.utcnow().isoformat()},
        )
        resp.raise_for_status()
        logger.info("ims_payment_confirmed", ims_ref=ims_order_ref, payment_ref=payment_ref)
        return True
    except httpx.HTTPError as e:
        logger.error("ims_payment_confirm_failed", ims_ref=ims_order_ref, error=str(e))
        return False
