from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import db
from routes import auth, admin, transactions, analytics
import os
from dotenv import load_dotenv

load_dotenv()

db.init_database()

# Get CORS origins from environment variable
cors_origins_str = os.getenv("CORS_ORIGINS", "http://localhost:5173")
cors_origins = [origin.strip() for origin in cors_origins_str.split(",")]

print("=" * 80)
print("🔧 CORS Configuration:")
print(f"📝 Raw CORS_ORIGINS env: {repr(cors_origins_str)}")
print(f"✅ Parsed origins: {cors_origins}")
print(f"🌐 Number of origins: {len(cors_origins)}")
print("=" * 80)

app = FastAPI(
    title="Payment Transactions System API",
    version="1.0.0",
    description="Информационная система управления платежными транзакциями"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
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
