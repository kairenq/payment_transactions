from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
import sqlite3
from models import UserRegister, UserLogin, UserResponse
from database import db
from security import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user_from_token
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register")
def register(user: UserRegister):
    """Register a new user"""
    print("=" * 80)
    print("📝 Registration attempt:")
    print(f"   Username: {user.username} (len: {len(user.username)})")
    print(f"   Email: {user.email}")
    print(f"   Password length: {len(user.password)}")
    print("=" * 80)

    conn = db.get_connection()
    cursor = conn.cursor()
    try:
        # Hash the password
        hashed_password = get_password_hash(user.password)

        cursor.execute(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            (user.username, user.email, hashed_password)
        )
        conn.commit()
        user_id = cursor.lastrowid
        cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        new_user = dict(cursor.fetchone())

        # Create access token
        access_token = create_access_token(data={"sub": new_user['id']})

        print(f"✅ User registered successfully: {user.username}")

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": new_user
        }
    except sqlite3.IntegrityError as e:
        print(f"❌ Registration failed: {e}")
        raise HTTPException(status_code=400, detail="Username or email already exists")
    finally:
        conn.close()

@router.post("/login")
def login(credentials: UserLogin):
    """Login with username and password"""
    conn = db.get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM users WHERE username = ? AND is_active = 1",
        (credentials.username,)
    )
    user = cursor.fetchone()
    conn.close()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Verify password
    if not verify_password(credentials.password, user['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Create access token
    access_token = create_access_token(data={"sub": user['id']})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": dict(user)
    }

@router.post("/logout")
def logout(current_user: dict = Depends(get_current_user_from_token)):
    """Logout (token-based, client should discard token)"""
    return {"message": "Logged out successfully"}

@router.get("/me", response_model=UserResponse)
def get_current_user(current_user: dict = Depends(get_current_user_from_token)):
    """Get current authenticated user"""
    return current_user
