from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import db
from routes import auth, admin, transactions, analytics
import os
import re
from dotenv import load_dotenv

load_dotenv()

db.init_database()

# Get CORS origins from environment variable
cors_origins_str = os.getenv("CORS_ORIGINS", "http://localhost:5173")
cors_origins = [origin.strip() for origin in cors_origins_str.split(",")]

# Allow all Netlify deploy previews and production domains
# This regex will match:
# - https://strong-sorbet-9b3219.netlify.app (production)
# - https://deploy-preview-*--strong-sorbet-9b3219.netlify.app (previews)
# - http://localhost:5173 (development)
cors_origin_regex = r"https://.*\.netlify\.app|http://localhost:\d+"

print("=" * 80)
print("🔧 CORS Configuration:")
print(f"📝 Raw CORS_ORIGINS env: {repr(cors_origins_str)}")
print(f"✅ Allowed origins: {cors_origins}")
print(f"🔓 Regex pattern: {cors_origin_regex}")
print(f"🌐 This allows all *.netlify.app subdomains and localhost")
print("=" * 80)

app = FastAPI(
    title="Payment Transactions System API",
    version="1.0.0",
    description="Информационная система управления платежными транзакциями"
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
