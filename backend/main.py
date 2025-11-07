from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from database import db
from routes import auth, admin, transactions, analytics
import os
import re
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

db.init_database()

# Get CORS origins from environment variable (for local development)
cors_origins_str = os.getenv("CORS_ORIGINS", "http://localhost:5173")
cors_origins = [origin.strip() for origin in cors_origins_str.split(",")]

print("=" * 80)
print("🔧 CORS Configuration:")
print(f"📝 Raw CORS_ORIGINS env: {repr(cors_origins_str)}")
print(f"✅ Allowed origins: {cors_origins}")
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
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API routes with /api prefix
app.include_router(auth.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
app.include_router(transactions.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")

@app.get("/api")
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

# Serve static files (frontend)
frontend_dist = Path(__file__).parent.parent / "frontend" / "dist"
if frontend_dist.exists():
    print(f"✅ Serving frontend from: {frontend_dist}")
    app.mount("/assets", StaticFiles(directory=str(frontend_dist / "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        """Serve frontend for all non-API routes (SPA fallback)"""
        file_path = frontend_dist / full_path

        # If file exists, serve it
        if file_path.is_file():
            return FileResponse(file_path)

        # Otherwise serve index.html (SPA routing)
        return FileResponse(frontend_dist / "index.html")
else:
    print(f"⚠️  Frontend dist not found at: {frontend_dist}")
    print("   Run: cd frontend && npm install && npm run build")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
