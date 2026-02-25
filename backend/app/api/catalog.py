from fastapi import APIRouter, HTTPException, Depends
from typing import List

from app.schemas.catalog import CatalogItemResponse, StockAvailabilityResponse
from app.services.ims_adapter import get_catalog_items, get_stock_availability
from app.utils.security import get_current_user

router = APIRouter()


@router.get("/items", response_model=List[CatalogItemResponse])
async def list_items(_=Depends(get_current_user)):
    """Fetch catalog items from IMS (source of truth)."""
    try:
        return await get_catalog_items()
    except Exception:
        raise HTTPException(502, "Unable to fetch catalog from IMS")


@router.get("/items/{sku}", response_model=CatalogItemResponse)
async def get_item(sku: str, _=Depends(get_current_user)):
    """Get single item by SKU from IMS."""
    try:
        items = await get_catalog_items()
        item = next((i for i in items if i.sku == sku), None)
        if not item:
            raise HTTPException(404, "Item not found")
        return item
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(502, "Unable to fetch item from IMS")


@router.get("/items/{sku}/availability", response_model=StockAvailabilityResponse)
async def check_availability(sku: str, _=Depends(get_current_user)):
    """Check real-time stock availability for a SKU."""
    try:
        return await get_stock_availability(sku)
    except Exception:
        raise HTTPException(502, "Unable to check stock availability")
