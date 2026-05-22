from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.order import Order
from app.schemas.order import OrderResponse
from app.utils.security import get_current_user

router = APIRouter()


@router.get("", response_model=List[OrderResponse])
def list_orders(db: Session = Depends(get_db), _=Depends(get_current_user)):
    orders = db.query(Order).order_by(Order.created_at.desc()).limit(100).all()
    return orders


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: str, db: Session = Depends(get_db), _=Depends(get_current_user)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(404, "Order not found")
    return order
