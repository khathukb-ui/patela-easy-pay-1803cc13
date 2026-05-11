from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class OrderItemResponse(BaseModel):
    id: str
    sku: str
    item_name_snapshot: str
    unit_price_snapshot: float
    qty: int
    line_total: float

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: str
    order_no: str
    customer_id: str
    status: str
    subtotal: float
    delivery_fee: float
    total: float
    ims_order_ref: Optional[str]
    created_at: datetime
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True
