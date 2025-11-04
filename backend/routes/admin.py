from fastapi import APIRouter, HTTPException, Depends
from typing import List
import sqlite3
from models import UserResponse, UserUpdate
from database import db
from security import get_current_user_from_token

router = APIRouter(prefix="/api/admin", tags=["Admin"])

def require_admin(current_user: dict = Depends(get_current_user_from_token)):
    if current_user.get('role') != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

@router.get("/users", response_model=List[UserResponse])
def get_all_users(admin: dict = Depends(require_admin)):
    conn = db.get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users ORDER BY created_at DESC")
    users = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return users

@router.put("/users/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user_update: UserUpdate, admin: dict = Depends(require_admin)):
    conn = db.get_connection()
    cursor = conn.cursor()
    update_fields = []
    values = []
    if user_update.username is not None:
        update_fields.append("username = ?")
        values.append(user_update.username)
    if user_update.email is not None:
        update_fields.append("email = ?")
        values.append(user_update.email)
    if user_update.role is not None:
        update_fields.append("role = ?")
        values.append(user_update.role)
    if user_update.is_active is not None:
        update_fields.append("is_active = ?")
        values.append(1 if user_update.is_active else 0)
    if not update_fields:
        raise HTTPException(status_code=400, detail="No fields to update")
    values.append(user_id)
    query = f"UPDATE users SET {', '.join(update_fields)} WHERE id = ?"
    try:
        cursor.execute(query, values)
        conn.commit()
        cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        updated_user = cursor.fetchone()
        conn.close()
        if not updated_user:
            raise HTTPException(status_code=404, detail="User not found")
        return dict(updated_user)
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(status_code=400, detail="Username or email already exists")

@router.delete("/users/{user_id}")
def delete_user(user_id: int, admin: dict = Depends(require_admin)):
    if user_id == 1:
        raise HTTPException(status_code=400, detail="Cannot delete default admin")
    conn = db.get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE id = ?", (user_id,))
    conn.commit()
    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")
    conn.close()
    return {"message": "User deleted"}

@router.get("/stats")
def get_statistics(admin: dict = Depends(require_admin)):
    conn = db.get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) as total FROM users")
    total_users = cursor.fetchone()['total']
    cursor.execute("SELECT COUNT(*) as active FROM users WHERE is_active = 1")
    active_users = cursor.fetchone()['active']
    cursor.execute("SELECT COUNT(*) as admins FROM users WHERE role = 'admin'")
    admin_count = cursor.fetchone()['admins']
    cursor.execute("SELECT COUNT(*) as recent FROM users WHERE created_at >= datetime('now', '-7 days')")
    recent_registrations = cursor.fetchone()['recent']
    conn.close()
    return {
        "total_users": total_users,
        "active_users": active_users,
        "admin_count": admin_count,
        "recent_registrations": recent_registrations
    }
