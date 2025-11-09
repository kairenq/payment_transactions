# Setup Instructions - Unified Deployment

## 🎉 Frontend and Backend Combined!

Now everything is served from **one Render service**. FastAPI serves both the API and the static frontend files.

---

## Deployment on Render

### What Happens Automatically:

1. **Build process** (`build.sh`):
   - Installs Python dependencies
   - Installs Node.js dependencies
   - Builds frontend to `frontend/dist`

2. **Runtime**:
   - FastAPI starts on port defined by `$PORT`
   - API available at `/api/*`
   - Frontend served from `/` (all other routes)
   - Health check at `/health`

### URLs:

- **Production**: https://payment-transactions.onrender.com
- **API docs**: https://payment-transactions.onrender.com/docs
- **Health check**: https://payment-transactions.onrender.com/health

---

## Environment Variables (already set in render.yaml)

```
SECRET_KEY = (auto-generated)
ALGORITHM = HS256
ACCESS_TOKEN_EXPIRE_MINUTES = 10080
CORS_ORIGINS = http://localhost:5173
PYTHON_VERSION = 3.11.0
NODE_VERSION = 18.17.0
```

---

## Local Development

### Option 1: Separate (Recommended for development)

**Terminal 1 - Backend:**
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Open: http://localhost:5173

### Option 2: Combined (Same as production)

```bash
./build.sh
cd backend
uvicorn main:app --reload --port 8000
```

Open: http://localhost:8000

---

## Manual Deployment to Render

If you need to deploy manually:

1. Go to https://dashboard.render.com
2. Create **New Web Service**
3. Connect your GitHub repo
4. Settings:
   ```
   Name: payment-transactions
   Environment: Python
   Build Command: ./build.sh
   Start Command: cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
5. Click **Create Web Service**

---

## How It Works

```
User Request → Render.com
              ↓
         FastAPI Server
         ├── /api/* → API endpoints
         ├── /health → Health check
         ├── /docs → Swagger UI
         └── /* → Frontend files (React SPA)
```

---

## Troubleshooting

### Frontend not loading?
- Check build logs: `./build.sh` should complete without errors
- Verify `frontend/dist` exists after build
- Check Render logs for "✅ Serving frontend from: ..."

### API not working?
- API is at `/api` not `/api/api`
- Frontend `.env.production` should have: `VITE_API_BASE_URL=/api`

### 502 Bad Gateway?
- Wait 1-2 minutes after deployment (cold start)
- Check Render logs for errors
- Verify health check: https://payment-transactions.onrender.com/health

---

## Cloudflare Pages No Longer Needed!

You can **delete** the Cloudflare Pages project. Everything is now on Render.

---

That's it! One service, one URL, everything works. 🚀
