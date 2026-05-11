from pydantic import BaseModel, Field
from typing import List, Optional


class AddCartItemRequest(BaseModel):
    sku: str
    qty: int = Field(1, ge=1)


class UpdateCartItemRequest(BaseModel):
    qty: int = Field(..., ge=0)


class CartItemResponse(BaseModel):
    id: str
    sku: str
    item_name_snapshot: str
    unit_price_snapshot: float
    qty: int
    line_total: float

    class Config:
        from_attributes = True


class CartResponse(BaseModel):
    id: str
    customer_id: str
    status: str
    items: List[CartItemResponse] = []
    total: float = 0

    class Config:
        from_attributes = True


class CreateCartRequest(BaseModel):
    customer_id: str
