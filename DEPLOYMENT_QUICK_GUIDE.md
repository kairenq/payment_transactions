# Quick Deployment Guide - Cloudflare Pages

## Problem Fixed 🎉

**Issue**: After migrating from Netlify to Cloudflare Pages, login stopped working with error:
```
ERR_CONNECTION_REFUSED
Failed to load resource: http://localhost:8000/api/auth/login
```

**Root Cause**: Frontend was hardcoded to use `localhost:8000` API URL.

**Solution**: Implemented environment variables for API configuration.

---

## Quick Setup (5 minutes)

### Step 1: Deploy Frontend to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Pages**
2. Click **Create a project** → **Connect to Git**
3. Select your repository
4. Configure build:
   ```
   Build command: cd frontend && npm install && npm run build
   Build output: frontend/dist
   Root directory: /
   ```
5. Add environment variable:
   ```
   VITE_API_BASE_URL = https://your-backend.railway.app/api
   ```
6. Deploy

### Step 2: Deploy Backend to Railway

1. Go to [Railway.app](https://railway.app/)
2. Create **New Project** → **Deploy from GitHub**
3. Add environment variables:
   ```
   SECRET_KEY=generate-a-random-32-character-string-here
   FRONTEND_URL=https://your-project.pages.dev
   ```
4. Copy your Railway backend URL (e.g., `https://payment-api.railway.app`)

### Step 3: Connect Them

1. Update `VITE_API_BASE_URL` on Cloudflare Pages with your Railway URL
2. Redeploy frontend on Cloudflare Pages
3. Done! ✅

---

## Environment Variables

### Frontend (Cloudflare Pages)
| Variable | Value |
|----------|-------|
| `VITE_API_BASE_URL` | `https://your-backend-url.com/api` |

### Backend (Railway/Render)
| Variable | Value |
|----------|-------|
| `SECRET_KEY` | Random 32+ character string |
| `FRONTEND_URL` | `https://your-frontend.pages.dev` |
| `ALGORITHM` | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `10080` |

---

## Troubleshooting

### Still seeing localhost in console?
→ Redeploy frontend after setting environment variables

### CORS errors?
→ Check `FRONTEND_URL` is set correctly on backend

### 401 Unauthorized?
→ Clear browser localStorage (F12 → Application → Clear Storage)

---

See [CLOUDFLARE_PAGES_DEPLOYMENT.md](./CLOUDFLARE_PAGES_DEPLOYMENT.md) for detailed guide in Russian.
