from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.ims_sync import ImsSyncAudit
from app.services.ims_adapter import get_catalog_items
from app.utils.security import require_role

router = APIRouter()


@router.get("/sync/health")
async def sync_health(db: Session = Depends(get_db), _=Depends(require_role("admin"))):
    """Check if IMS is reachable."""
    try:
        items = await get_catalog_items()
        return {"status": "healthy", "item_count": len(items), "checked_at": datetime.utcnow().isoformat()}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e), "checked_at": datetime.utcnow().isoformat()}


@router.post("/sync/catalog")
async def sync_catalog(db: Session = Depends(get_db), _=Depends(require_role("admin"))):
    """Trigger a manual catalog sync from IMS and log the result."""
    try:
        items = await get_catalog_items()
        audit = ImsSyncAudit(
            sync_type="catalog",
            status="success",
            details_json={"item_count": len(items)},
        )
        db.add(audit)
        db.commit()
        return {"status": "success", "items_synced": len(items)}
    except Exception as e:
        audit = ImsSyncAudit(
            sync_type="catalog",
            status="failed",
            details_json={"error": str(e)},
        )
        db.add(audit)
        db.commit()
        raise HTTPException(502, f"Catalog sync failed: {e}")
