from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from database import db
from routes import auth, admin, transactions, analytics
import os
import re
from dotenv import load_dotenv

load_dotenv()

db.init_database()

# Get CORS origins from environment variable
cors_origins_str = os.getenv("CORS_ORIGINS", "http://localhost:5173,https://payment-transactions.pages.dev")
cors_origins = [origin.strip() for origin in cors_origins_str.split(",")]

# Allow all Cloudflare Pages deploy previews and production domains
# This regex will match:
# - https://payment-transactions.pages.dev (production)
# - https://*.payment-transactions.pages.dev (branch previews)
# - https://*.pages.dev (any Cloudflare Pages project)
# - http://localhost:5173 (development)
cors_origin_regex = r"https://.*\.pages\.dev|http://localhost:\d+"

print("=" * 80)
print("🔧 CORS Configuration:")
print(f"📝 Raw CORS_ORIGINS env: {repr(cors_origins_str)}")
print(f"✅ Allowed origins: {cors_origins}")
print(f"🔓 Regex pattern: {cors_origin_regex}")
print(f"🌐 This allows all *.pages.dev (Cloudflare Pages) and localhost")
print("=" * 80)

app = FastAPI(
    title="Payment Transactions System API",
    version="1.0.0",
    description="Информационная система управления платежными транзакциями"
)

# Middleware to log all requests
@app.middleware("http")
async def log_requests(request: Request, call_next):
    # Read and cache body for logging
    body = None
    if request.method in ["POST", "PUT", "PATCH"]:
        try:
            body_bytes = await request.body()
            body = body_bytes.decode()
            # Re-create request with cached body
            async def receive():
                return {"type": "http.request", "body": body_bytes}
            request._receive = receive
        except:
            pass

    # Log request
    if "/auth/register" in str(request.url):
        print("=" * 80)
        print(f"📥 INCOMING REQUEST TO /auth/register")
        print(f"   Method: {request.method}")
        print(f"   Headers: {dict(request.headers)}")
        print(f"   Body: {body}")
        print("=" * 80)

    # Process request
    response = await call_next(request)

    # Log response for /auth/register
    if "/auth/register" in str(request.url):
        print(f"📤 RESPONSE: Status {response.status_code}")

    return response

# Handle validation errors with detailed logging
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    print("=" * 80)
    print("❌ VALIDATION ERROR (422):")
    print(f"   URL: {request.url}")
    print(f"   Errors: {errors}")
    print("=" * 80)
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": errors},
    )

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=cors_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(transactions.router)
app.include_router(analytics.router)

@app.get("/")
def root():
    return {
        "message": "Payment Transactions System API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "running"
    }

@app.get("/health")
@app.head("/health")
def health_check():
    """Health check endpoint for uptime monitoring (e.g., UptimeRobot, Render)"""
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
