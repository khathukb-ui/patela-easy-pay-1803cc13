# Patela Easy Pay — Backend

Production-ready Python FastAPI backend with IMS integration.

## Quick Start

```bash
# Copy environment
cp .env.example .env
# Edit .env with your values

# Start with Docker
docker-compose up --build

# Run migrations
docker-compose exec api alembic upgrade head

# API docs
open http://localhost:8000/docs
```

## Architecture

```
app/
├── main.py           # FastAPI app entry
├── config.py         # Pydantic settings
├── database.py       # SQLAlchemy engine
├── models/           # ORM models
├── schemas/          # Pydantic request/response
├── api/              # Route handlers
├── services/         # IMS adapter
├── providers/        # Payment provider abstraction
├── middleware/        # Rate limiting
└── utils/            # Security, logging
```

## Key Principles

- **IMS is the source of truth** for items, stock, and pricing
- **Patela reads** catalog from IMS, **pushes** orders and payment confirmations back
- **No demo/mock data** — real error states when backend is unavailable
- **OTP disabled** via `FEATURE_OTP_ENABLED=false` feature flag

## API Docs

Visit `/docs` (Swagger) or `/redoc` when running.

## Tests

```bash
pip install pytest
pytest tests/
```
