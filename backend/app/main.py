from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api import auth, catalog, cart, checkout, orders, payments, admin
from app.utils.logging import setup_logging

setup_logging()

app = FastAPI(
    title="Patela Easy Pay API",
    version="1.0.0",
    description="Production backend for Patela Easy Pay — integrated with IMS",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(catalog.router, prefix="/api/catalog", tags=["Catalog"])
app.include_router(cart.router, prefix="/api/cart", tags=["Cart"])
app.include_router(checkout.router, prefix="/api/checkout", tags=["Checkout"])
app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])
app.include_router(payments.router, prefix="/api/payments", tags=["Payments"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])


@app.get("/health")
def health():
    return {"status": "ok"}
