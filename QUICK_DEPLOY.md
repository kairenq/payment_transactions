# ⚡ Quick Deploy Guide

Быстрое руководство для деплоя на Render + Netlify (5-10 минут)

---

## 1️⃣ Render (Backend)

1. Перейдите на [render.com](https://render.com) → Sign up с GitHub
2. **New +** → **Web Service** → Выберите ваш репозиторий
3. Настройки:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `sh start.sh`
4. Environment Variables:
   - `SECRET_KEY`: Generate (автоматически)
   - `ALGORITHM`: `HS256`
   - `ACCESS_TOKEN_EXPIRE_MINUTES`: `10080`
5. **Create Web Service**
6. **Скопируйте URL:** `https://your-app.onrender.com`

---

## 2️⃣ Netlify (Frontend)

1. Перейдите на [netlify.com](https://netlify.com) → Sign up с GitHub
2. **Add new site** → **Import from Git** → Выберите репозиторий
3. Настройки:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
4. Environment Variable:
   - Key: `VITE_API_BASE_URL`
   - Value: `https://your-render-app.onrender.com/api` ⚠️ НЕ ЗАБУДЬТЕ `/api`
5. **Deploy site**
6. **Скопируйте URL:** `https://your-app.netlify.app`

---

## 3️⃣ Финальный шаг - CORS

1. Вернитесь в **Render Dashboard**
2. Откройте ваш Web Service → **Environment**
3. Добавьте/обновите:
   - Key: `CORS_ORIGINS`
   - Value: `https://your-app.netlify.app` (ваш реальный Netlify URL)
4. **Save Changes** (автоматический redeploy)

---

## ✅ Готово!

Откройте `https://your-app.netlify.app` и войдите:
- Username: `admin`
- Password: `admin123`

---

## 🆘 Проблемы?

- **CORS Error:** Проверьте что CORS_ORIGINS точно совпадает с Netlify URL
- **404 на страницах:** Убедитесь что netlify.toml настроен (уже должен быть)
- **API не работает:** Проверьте что VITE_API_BASE_URL включает `/api` в конце

**Подробный гайд:** См. [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
