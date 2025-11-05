from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import db
from routes import auth, admin, transactions, analytics
import os

db.init_database()

app = FastAPI(title="Payment Transactions System API", version="1.0.0", description="Информационная система управления платежными транзакциями")

# CORS origins - support both development and production
CORS_ORIGINS = [
    "http://localhost:5173",  # Local development
    "http://localhost:3000",  # Alternative local port
]

# Add production origins from environment variable
production_origin = os.getenv("FRONTEND_URL")
if production_origin:
    CORS_ORIGINS.append(production_origin)
    print(f"✅ Added production frontend URL to CORS: {production_origin}")

# For Cloudflare Pages, you may need to add your specific domain
# Example: CORS_ORIGINS.append("https://your-app.pages.dev")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
