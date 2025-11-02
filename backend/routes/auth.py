from fastapi import APIRouter, HTTPException, Response, Cookie
from typing import Optional
import sqlite3
from models import UserRegister, UserLogin, UserResponse
from database import db

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse)
def register(user: UserRegister):
    conn = db.get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            (user.username, user.email, user.password)
        )
        conn.commit()
        user_id = cursor.lastrowid
        cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        new_user = dict(cursor.fetchone())
        return new_user
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Username or email already exists")
    finally:
        conn.close()

@router.post("/login", response_model=UserResponse)
def login(credentials: UserLogin, response: Response):
    conn = db.get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM users WHERE username = ? AND password = ? AND is_active = 1",
        (credentials.username, credentials.password)
    )
    user = cursor.fetchone()
    if not user:
        conn.close()
        raise HTTPException(status_code=401, detail="Invalid credentials")

    cursor.execute("INSERT INTO sessions (user_id) VALUES (?)", (user['id'],))
    session_id = cursor.lastrowid
    conn.commit()
    conn.close()

    response.set_cookie(
        key="session_id", value=str(session_id), httponly=True,
        max_age=86400 * 7, samesite="lax"
    )
    return dict(user)

@router.post("/logout")
def logout(response: Response, session_id: Optional[str] = Cookie(None)):
    if session_id:
        conn = db.get_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM sessions WHERE id = ?", (session_id,))
        conn.commit()
        conn.close()
    response.delete_cookie(key="session_id")
    return {"message": "Logged out"}

@router.get("/me", response_model=UserResponse)
def get_current_user(session_id: Optional[str] = Cookie(None)):
    if not session_id:
        raise HTTPException(status_code=401, detail="Not authenticated")
    conn = db.get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT u.* FROM users u
        JOIN sessions s ON u.id = s.user_id
        WHERE s.id = ? AND u.is_active = 1
    """, (session_id,))
    user = cursor.fetchone()
    conn.close()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid session")
    return dict(user)
