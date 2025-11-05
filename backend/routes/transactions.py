from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
import sqlite3
from datetime import datetime
from models import (
    TransactionCreate, TransactionUpdate, TransactionResponse,
    TransactionWithCategory, TransactionHistoryResponse,
    PaymentCategoryCreate, PaymentCategoryUpdate, PaymentCategoryResponse,
    UserResponse
)
from database import db
from security import get_current_user_from_token

router = APIRouter(prefix="/api/transactions", tags=["Transactions"])

# ==================== КАТЕГОРИИ ====================

@router.get("/categories", response_model=List[PaymentCategoryResponse])
def get_categories(current_user: dict = Depends(get_current_user_from_token)):
    conn = db.get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM payment_categories ORDER BY name")
    categories = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return categories

@router.post("/categories", response_model=PaymentCategoryResponse)
def create_category(
    category: PaymentCategoryCreate,
    current_user: dict = Depends(get_current_user_from_token)
):
    conn = db.get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO payment_categories (name, description, color, icon) VALUES (?, ?, ?, ?)",
            (category.name, category.description, category.color, category.icon)
        )
        conn.commit()
        category_id = cursor.lastrowid
        cursor.execute("SELECT * FROM payment_categories WHERE id = ?", (category_id,))
        new_category = dict(cursor.fetchone())
        conn.close()
        return new_category
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(status_code=400, detail="Category with this name already exists")

@router.put("/categories/{category_id}", response_model=PaymentCategoryResponse)
def update_category(
    category_id: int,
    category_update: PaymentCategoryUpdate,
    current_user: dict = Depends(get_current_user_from_token)
):
    conn = db.get_connection()
    cursor = conn.cursor()
    update_fields = []
    values = []
    if category_update.name is not None:
        update_fields.append("name = ?")
        values.append(category_update.name)
    if category_update.description is not None:
        update_fields.append("description = ?")
        values.append(category_update.description)
    if category_update.color is not None:
        update_fields.append("color = ?")
        values.append(category_update.color)
    if category_update.icon is not None:
        update_fields.append("icon = ?")
        values.append(category_update.icon)
    if not update_fields:
        raise HTTPException(status_code=400, detail="No fields to update")
    values.append(category_id)
    query = f"UPDATE payment_categories SET {', '.join(update_fields)} WHERE id = ?"
    try:
        cursor.execute(query, values)
        conn.commit()
        cursor.execute("SELECT * FROM payment_categories WHERE id = ?", (category_id,))
        updated_category = cursor.fetchone()
        conn.close()
        if not updated_category:
            raise HTTPException(status_code=404, detail="Category not found")
        return dict(updated_category)
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(status_code=400, detail="Category name already exists")

@router.delete("/categories/{category_id}")
def delete_category(
    category_id: int,
    current_user: dict = Depends(get_current_user_from_token)
):
    conn = db.get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM payment_categories WHERE id = ?", (category_id,))
    conn.commit()
    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Category not found")
    conn.close()
    return {"message": "Category deleted"}

# ==================== ТРАНЗАКЦИИ ====================

@router.get("/", response_model=List[TransactionWithCategory])
def get_transactions(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    type: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    category_id: Optional[int] = Query(None),
    current_user: dict = Depends(get_current_user_from_token)
):
    conn = db.get_connection()
    cursor = conn.cursor()

    query = """
        SELECT
            t.*,
            pc.name as category_name,
            pc.color as category_color,
            pc.icon as category_icon
        FROM transactions t
        LEFT JOIN payment_categories pc ON t.category_id = pc.id
        WHERE t.user_id = ?
    """
    params = [current_user["id"]]

    # Игнорируем пустые строки
    if type and type.strip():
        query += " AND t.type = ?"
        params.append(type)
    if status and status.strip():
        query += " AND t.status = ?"
        params.append(status)
    if category_id:
        query += " AND t.category_id = ?"
        params.append(category_id)

    query += " ORDER BY t.transaction_date DESC, t.created_at DESC LIMIT ? OFFSET ?"
    params.extend([limit, skip])

    cursor.execute(query, params)
    transactions = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return transactions

@router.get("/{transaction_id}", response_model=TransactionWithCategory)
def get_transaction(
    transaction_id: int,
    current_user: dict = Depends(get_current_user_from_token)
):
    conn = db.get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT
            t.*,
            pc.name as category_name,
            pc.color as category_color,
            pc.icon as category_icon
        FROM transactions t
        LEFT JOIN payment_categories pc ON t.category_id = pc.id
        WHERE t.id = ? AND t.user_id = ?
    """, (transaction_id, current_user["id"]))
    transaction = cursor.fetchone()
    conn.close()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return dict(transaction)

@router.post("/", response_model=TransactionResponse)
def create_transaction(
    transaction: TransactionCreate,
    current_user: dict = Depends(get_current_user_from_token)
):
    conn = db.get_connection()
    cursor = conn.cursor()

    transaction_date = transaction.transaction_date or datetime.now().isoformat()

    cursor.execute("""
        INSERT INTO transactions
        (user_id, category_id, type, amount, currency, description, recipient, sender, transaction_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        current_user["id"],
        transaction.category_id,
        transaction.type,
        transaction.amount,
        transaction.currency,
        transaction.description,
        transaction.recipient,
        transaction.sender,
        transaction_date
    ))
    conn.commit()
    transaction_id = cursor.lastrowid

    # Логирование в историю
    cursor.execute("""
        INSERT INTO transaction_history (transaction_id, user_id, action, new_status, notes)
        VALUES (?, ?, ?, ?, ?)
    """, (transaction_id, current_user["id"], 'created', 'pending', 'Transaction created'))
    conn.commit()

    cursor.execute("SELECT * FROM transactions WHERE id = ?", (transaction_id,))
    new_transaction = dict(cursor.fetchone())
    conn.close()
    return new_transaction

@router.put("/{transaction_id}", response_model=TransactionResponse)
def update_transaction(
    transaction_id: int,
    transaction_update: TransactionUpdate,
    current_user: dict = Depends(get_current_user_from_token)
):
    conn = db.get_connection()
    cursor = conn.cursor()

    # Проверка существования и владельца
    cursor.execute("SELECT * FROM transactions WHERE id = ? AND user_id = ?", (transaction_id, current_user["id"]))
    old_transaction = cursor.fetchone()
    if not old_transaction:
        conn.close()
        raise HTTPException(status_code=404, detail="Transaction not found")

    old_status = old_transaction['status']

    update_fields = ["updated_at = CURRENT_TIMESTAMP"]
    values = []

    if transaction_update.category_id is not None:
        update_fields.append("category_id = ?")
        values.append(transaction_update.category_id)
    if transaction_update.type is not None:
        update_fields.append("type = ?")
        values.append(transaction_update.type)
    if transaction_update.amount is not None:
        update_fields.append("amount = ?")
        values.append(transaction_update.amount)
    if transaction_update.currency is not None:
        update_fields.append("currency = ?")
        values.append(transaction_update.currency)
    if transaction_update.status is not None:
        update_fields.append("status = ?")
        values.append(transaction_update.status)
    if transaction_update.description is not None:
        update_fields.append("description = ?")
        values.append(transaction_update.description)
    if transaction_update.recipient is not None:
        update_fields.append("recipient = ?")
        values.append(transaction_update.recipient)
    if transaction_update.sender is not None:
        update_fields.append("sender = ?")
        values.append(transaction_update.sender)
    if transaction_update.transaction_date is not None:
        update_fields.append("transaction_date = ?")
        values.append(transaction_update.transaction_date)

    if len(values) == 0:
        raise HTTPException(status_code=400, detail="No fields to update")

    values.append(transaction_id)
    values.append(current_user["id"])
    query = f"UPDATE transactions SET {', '.join(update_fields)} WHERE id = ? AND user_id = ?"

    cursor.execute(query, values)
    conn.commit()

    # Логирование изменений
    new_status = transaction_update.status if transaction_update.status else old_status
    cursor.execute("""
        INSERT INTO transaction_history (transaction_id, user_id, action, old_status, new_status, notes)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (transaction_id, current_user["id"], 'updated', old_status, new_status, 'Transaction updated'))
    conn.commit()

    cursor.execute("SELECT * FROM transactions WHERE id = ?", (transaction_id,))
    updated_transaction = dict(cursor.fetchone())
    conn.close()
    return updated_transaction

@router.delete("/{transaction_id}")
def delete_transaction(
    transaction_id: int,
    current_user: dict = Depends(get_current_user_from_token)
):
    conn = db.get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM transactions WHERE id = ? AND user_id = ?", (transaction_id, current_user["id"]))
    conn.commit()
    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Transaction not found")
    conn.close()
    return {"message": "Transaction deleted"}

# ==================== ИСТОРИЯ ====================

@router.get("/{transaction_id}/history", response_model=List[TransactionHistoryResponse])
def get_transaction_history(
    transaction_id: int,
    current_user: dict = Depends(get_current_user_from_token)
):
    conn = db.get_connection()
    cursor = conn.cursor()

    # Проверка доступа
    cursor.execute("SELECT id FROM transactions WHERE id = ? AND user_id = ?", (transaction_id, current_user["id"]))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Transaction not found")

    cursor.execute("""
        SELECT * FROM transaction_history
        WHERE transaction_id = ?
        ORDER BY created_at DESC
    """, (transaction_id,))
    history = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return history
