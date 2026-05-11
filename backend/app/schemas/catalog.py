from pydantic import BaseModel
from typing import Optional


class CatalogItemResponse(BaseModel):
    sku: str
    name: str
    price: float
    category: Optional[str] = None
    image_url: Optional[str] = None
    in_stock: bool
    available_qty: int


class StockAvailabilityResponse(BaseModel):
    sku: str
    available_qty: int
    in_stock: bool
