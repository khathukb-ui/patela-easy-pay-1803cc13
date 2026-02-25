"""
Simple in-memory rate limiter.
For production, use Redis-backed solution.
"""

import time
from collections import defaultdict
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware

# Store: { ip: [(timestamp, ...)] }
_requests: dict[str, list[float]] = defaultdict(list)

RATE_LIMIT = 30  # requests
RATE_WINDOW = 60  # seconds


class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.url.path.startswith("/api/auth"):
            ip = request.client.host if request.client else "unknown"
            now = time.time()
            _requests[ip] = [t for t in _requests[ip] if now - t < RATE_WINDOW]

            if len(_requests[ip]) >= RATE_LIMIT:
                raise HTTPException(429, "Too many requests. Try again later.")

            _requests[ip].append(now)

        return await call_next(request)
