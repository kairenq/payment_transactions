# Setup Instructions

## 1. Cloudflare Pages Settings

Go to: https://dash.cloudflare.com/ → Pages → payment-transactions → Settings → Environment variables

### Add this variable:

```
VITE_API_BASE_URL = https://payment-transactions.onrender.com/api
```

**Important:** After adding the variable, go to **Deployments** tab and click **Retry deployment** on the latest build.

---

## 2. Render Settings

Go to: https://dashboard.render.com/ → payment-transactions (backend) → Environment

### Add these variables:

```
FRONTEND_URL = https://payment-transactions.pages.dev
SECRET_KEY = (generate random 32+ character string or keep default)
ALGORITHM = HS256
ACCESS_TOKEN_EXPIRE_MINUTES = 10080
```

**Important:** After adding variables, Render will automatically redeploy your backend.

---

## 3. Test

1. Open https://payment-transactions.pages.dev
2. Press F12 (DevTools)
3. Look at Console - you should see:
   ```
   🌐 API Base URL: https://payment-transactions.onrender.com/api
   ```
4. Try to login

If you see `localhost` in console → Redeploy on Cloudflare Pages

---

## Quick Fix if Not Working

### Clear browser cache:
1. F12 → Application tab
2. Click "Clear storage"
3. Click "Clear site data"
4. Refresh page

### Redeploy frontend:
1. Cloudflare Pages → Deployments
2. Click "Retry deployment" on latest build

---

That's it! 🚀
