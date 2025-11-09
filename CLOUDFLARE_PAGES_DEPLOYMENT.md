# Развёртывание на Cloudflare Pages

Это руководство поможет развернуть систему управления платежными транзакциями на Cloudflare Pages (фронтенд) и настроить бэкенд.

## 🔧 Исправленные проблемы

После миграции с Netlify на Cloudflare Pages были исправлены следующие проблемы:

1. ✅ **Hardcoded API URL**: Теперь используются переменные окружения
2. ✅ **CORS настройки**: Добавлена поддержка production URL
3. ✅ **Environment variables**: Настроена конфигурация для разных окружений
4. ✅ **Routing**: Добавлен файл `_redirects` для React Router
5. ✅ **Security headers**: Добавлены заголовки безопасности через `_headers`

## 📋 Предварительные требования

### Frontend (Cloudflare Pages)
- Аккаунт на [Cloudflare](https://dash.cloudflare.com/)
- Репозиторий на GitHub/GitLab
- Node.js 18+ (для локальной сборки)

### Backend (нужен отдельный хостинг)
Cloudflare Pages **не** может хостить FastAPI backend. Выберите один из вариантов:

- **Cloudflare Workers** (рекомендуется для Cloudflare Pages)
- **Railway.app** (бесплатный tier доступен)
- **Render.com** (бесплатный tier доступен)
- **Heroku** (платный)
- **DigitalOcean/VPS** (платный)

---

## 🚀 Шаг 1: Развертывание Frontend на Cloudflare Pages

### 1.1. Подключите репозиторий к Cloudflare Pages

1. Перейдите в [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Выберите **Pages** в левом меню
3. Нажмите **Create a project**
4. Выберите **Connect to Git**
5. Авторизуйте GitHub/GitLab и выберите ваш репозиторий

### 1.2. Настройте Build Settings

В настройках проекта укажите:

```
Framework preset: Vite
Build command: cd frontend && npm install && npm run build
Build output directory: frontend/dist
Root directory: /
```

### 1.3. Настройте Environment Variables

В разделе **Settings → Environment variables** добавьте:

| Variable Name | Value | Example |
|--------------|-------|---------|
| `VITE_API_BASE_URL` | URL вашего backend API | `https://your-api.railway.app/api` |
| `NODE_VERSION` | 18 | `18` |

**Важно**: Переменная `VITE_API_BASE_URL` должна указывать на ваш backend API!

### 1.4. Deploy

1. Нажмите **Save and Deploy**
2. Cloudflare Pages начнёт сборку и деплой
3. После завершения вы получите URL вида: `https://your-project.pages.dev`

---

## 🔌 Шаг 2: Развертывание Backend

### Вариант A: Railway.app (Рекомендуется для простоты)

#### 2.1. Создайте проект на Railway

1. Перейдите на [Railway.app](https://railway.app/)
2. Нажмите **New Project**
3. Выберите **Deploy from GitHub repo**
4. Выберите ваш репозиторий

#### 2.2. Настройте Backend Service

В настройках сервиса:

```
Start Command: cd backend && pip install -r requirements.txt && uvicorn main:app --host 0.0.0.0 --port $PORT
Root Directory: /
```

#### 2.3. Добавьте Environment Variables

В Railway добавьте переменные окружения:

```env
SECRET_KEY=your-very-long-secret-key-min-32-characters-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
FRONTEND_URL=https://your-project.pages.dev
PORT=8000
```

**Важно**:
- Измените `SECRET_KEY` на случайную строку минимум 32 символа!
- Замените `FRONTEND_URL` на ваш реальный URL Cloudflare Pages

#### 2.4. Получите Backend URL

После деплоя Railway выдаст вам URL вида:
```
https://your-project.railway.app
```

**Этот URL нужно указать в `VITE_API_BASE_URL` на Cloudflare Pages!**

---

### Вариант B: Render.com

1. Перейдите на [Render.com](https://render.com/)
2. Создайте **New Web Service**
3. Подключите GitHub репозиторий
4. Настройте:
   ```
   Build Command: cd backend && pip install -r requirements.txt
   Start Command: cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
5. Добавьте те же Environment Variables, что и для Railway
6. Deploy

---

### Вариант C: Cloudflare Workers (Для продвинутых)

Cloudflare Workers может запускать Python через Workers + FastAPI, но требует адаптации:

1. Установите Wrangler CLI: `npm install -g wrangler`
2. Используйте Python Workers (требует переписывания под Workers runtime)
3. Или используйте serverless адаптер для FastAPI

**Примечание**: Этот вариант сложнее и требует дополнительной настройки.

---

## 🔄 Шаг 3: Финальная настройка

### 3.1. Обновите VITE_API_BASE_URL на Cloudflare Pages

После развертывания backend:

1. Скопируйте URL вашего backend (например, `https://your-api.railway.app`)
2. Откройте Cloudflare Pages → Settings → Environment variables
3. Измените `VITE_API_BASE_URL` на:
   ```
   https://your-api.railway.app/api
   ```
   (обратите внимание на `/api` в конце!)
4. Нажмите **Save**
5. Перейдите в **Deployments** → **Redeploy** для пересборки

### 3.2. Обновите FRONTEND_URL на Backend

На вашем backend (Railway/Render/etc):

1. Скопируйте URL вашего Cloudflare Pages (например, `https://your-project.pages.dev`)
2. Установите переменную окружения `FRONTEND_URL` на backend:
   ```
   FRONTEND_URL=https://your-project.pages.dev
   ```
3. Перезапустите backend сервис

---

## ✅ Шаг 4: Проверка

### 4.1. Проверьте Frontend

Откройте ваш Cloudflare Pages URL:
```
https://your-project.pages.dev
```

### 4.2. Проверьте Backend API

Откройте Swagger документацию вашего backend:
```
https://your-api.railway.app/docs
```

### 4.3. Проверьте логин

1. Откройте браузер DevTools (F12)
2. Перейдите на страницу логина
3. В Console вы должны увидеть:
   ```
   🌐 API Base URL: https://your-api.railway.app/api
   ```
   (НЕ localhost!)

4. Попробуйте залогиниться с тестовыми данными

---

## 🐛 Устранение неисправностей

### Проблема: ERR_CONNECTION_REFUSED

**Причина**: Frontend пытается подключиться к localhost
**Решение**:
1. Проверьте, что `VITE_API_BASE_URL` установлен на Cloudflare Pages
2. Убедитесь, что переменная заканчивается на `/api`
3. Redeploy frontend после изменения переменной

### Проблема: CORS Error

**Причина**: Backend не разрешает запросы с вашего Cloudflare Pages домена
**Решение**:
1. Проверьте `FRONTEND_URL` на backend
2. Убедитесь, что URL точно совпадает (включая https://)
3. Перезапустите backend после изменения

### Проблема: 401 Unauthorized

**Причина**: Проблемы с JWT токеном или SECRET_KEY
**Решение**:
1. Убедитесь, что `SECRET_KEY` установлен на backend
2. Проверьте, что `SECRET_KEY` одинаковый везде
3. Очистите localStorage в браузере (F12 → Application → Clear Storage)

### Проблема: 500 Internal Server Error

**Причина**: Ошибка на backend
**Решение**:
1. Проверьте логи backend в Railway/Render
2. Убедитесь, что база данных инициализирована
3. Проверьте все environment variables

---

## 📱 Проверка через консоль браузера

Откройте DevTools (F12) и выполните:

```javascript
// Проверить текущий API URL
console.log('API URL:', localStorage.getItem('api_url') || 'default');

// Проверить токен
console.log('Has token:', !!localStorage.getItem('access_token'));

// Очистить всё и начать заново
localStorage.clear();
location.reload();
```

---

## 📚 Дополнительные ресурсы

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Railway.app Docs](https://docs.railway.app/)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

## 🔐 Безопасность в Production

**Критически важно:**

1. **SECRET_KEY**: Сгенерируйте случайный ключ минимум 32 символа
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

2. **CORS**: Ограничьте `FRONTEND_URL` только вашим доменом

3. **HTTPS**: Убедитесь, что и frontend, и backend используют HTTPS

4. **Database**: В production используйте PostgreSQL, а не SQLite

5. **Environment Variables**: Никогда не коммитьте `.env` файлы с реальными ключами!

---

## 📝 Структура переменных окружения

### Frontend (Cloudflare Pages)
```env
VITE_API_BASE_URL=https://your-backend-api.com/api
```

### Backend (Railway/Render/etc)
```env
SECRET_KEY=your-very-long-secret-key-32-chars-minimum
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
FRONTEND_URL=https://your-frontend.pages.dev
```

---

## ✨ Что было изменено в коде

### 1. `frontend/src/services/api.js`
```javascript
// Было:
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  ...
});

// Стало:
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const api = axios.create({
  baseURL: API_BASE_URL,
  ...
});
```

### 2. `backend/main.py`
```python
# Было:
allow_origins=["http://localhost:5173"]

# Стало:
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
]
production_origin = os.getenv("FRONTEND_URL")
if production_origin:
    CORS_ORIGINS.append(production_origin)

allow_origins=CORS_ORIGINS
```

### 3. Новые файлы:
- `frontend/.env.example`
- `frontend/.env.production.example`
- `frontend/public/_headers`
- `frontend/public/_redirects`
- `backend/.env.example` (обновлён)

---

Удачного деплоя! 🚀
