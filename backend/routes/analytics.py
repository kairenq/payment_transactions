from fastapi import APIRouter, Depends, Query
from typing import List, Optional
from datetime import datetime, timedelta
from models import StatsResponse, UserResponse
from database import db
from routes.auth import get_current_user

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

@router.get("/stats", response_model=StatsResponse)
def get_user_statistics(
    current_user: UserResponse = Depends(get_current_user)
):
    conn = db.get_connection()
    cursor = conn.cursor()

    # Общее количество транзакций
    cursor.execute(
        "SELECT COUNT(*) as total FROM transactions WHERE user_id = ?",
        (current_user.id,)
    )
    total_transactions = cursor.fetchone()['total']

    # Общий доход
    cursor.execute(
        "SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE user_id = ? AND type = 'income' AND status = 'completed'",
        (current_user.id,)
    )
    total_income = cursor.fetchone()['total']

    # Общие расходы
    cursor.execute(
        "SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE user_id = ? AND type = 'expense' AND status = 'completed'",
        (current_user.id,)
    )
    total_expense = cursor.fetchone()['total']

    # Баланс
    balance = total_income - total_expense

    # Количество по статусам
    cursor.execute(
        "SELECT COUNT(*) as count FROM transactions WHERE user_id = ? AND status = 'pending'",
        (current_user.id,)
    )
    pending_count = cursor.fetchone()['count']

    cursor.execute(
        "SELECT COUNT(*) as count FROM transactions WHERE user_id = ? AND status = 'completed'",
        (current_user.id,)
    )
    completed_count = cursor.fetchone()['count']

    cursor.execute(
        "SELECT COUNT(*) as count FROM transactions WHERE user_id = ? AND status = 'failed'",
        (current_user.id,)
    )
    failed_count = cursor.fetchone()['count']

    cursor.execute(
        "SELECT COUNT(*) as count FROM transactions WHERE user_id = ? AND status = 'cancelled'",
        (current_user.id,)
    )
    cancelled_count = cursor.fetchone()['count']

    conn.close()

    return {
        "total_transactions": total_transactions,
        "total_income": round(total_income, 2),
        "total_expense": round(total_expense, 2),
        "balance": round(balance, 2),
        "pending_count": pending_count,
        "completed_count": completed_count,
        "failed_count": failed_count,
        "cancelled_count": cancelled_count
    }

@router.get("/chart/monthly")
def get_monthly_chart_data(
    months: int = Query(6, ge=1, le=24),
    current_user: UserResponse = Depends(get_current_user)
):
    conn = db.get_connection()
    cursor = conn.cursor()

    cursor.execute(f"""
        SELECT
            strftime('%Y-%m', transaction_date) as month,
            type,
            COALESCE(SUM(amount), 0) as total
        FROM transactions
        WHERE user_id = ? AND status = 'completed'
            AND transaction_date >= date('now', '-{months} months')
        GROUP BY month, type
        ORDER BY month
    """, (current_user.id,))

    results = cursor.fetchall()
    conn.close()

    # Преобразование в формат для Recharts
    data_dict = {}
    for row in results:
        month = row['month']
        if month not in data_dict:
            data_dict[month] = {'month': month, 'income': 0, 'expense': 0}
        data_dict[month][row['type']] = round(row['total'], 2)

    return list(data_dict.values())

@router.get("/chart/category")
def get_category_chart_data(
    days: int = Query(30, ge=1, le=365),
    current_user: UserResponse = Depends(get_current_user)
):
    conn = db.get_connection()
    cursor = conn.cursor()

    cursor.execute(f"""
        SELECT
            pc.name as category,
            pc.color as color,
            COALESCE(SUM(t.amount), 0) as total
        FROM transactions t
        LEFT JOIN payment_categories pc ON t.category_id = pc.id
        WHERE t.user_id = ? AND t.status = 'completed'
            AND t.type = 'expense'
            AND t.transaction_date >= date('now', '-{days} days')
        GROUP BY pc.name, pc.color
        ORDER BY total DESC
    """, (current_user.id,))

    results = [dict(row) for row in cursor.fetchall()]
    conn.close()

    for item in results:
        item['total'] = round(item['total'], 2)

    return results

@router.get("/chart/status")
def get_status_chart_data(
    current_user: UserResponse = Depends(get_current_user)
):
    conn = db.get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            status,
            COUNT(*) as count
        FROM transactions
        WHERE user_id = ?
        GROUP BY status
    """, (current_user.id,))

    results = [dict(row) for row in cursor.fetchall()]
    conn.close()

    return results

@router.get("/chart/daily")
def get_daily_chart_data(
    days: int = Query(7, ge=1, le=90),
    current_user: UserResponse = Depends(get_current_user)
):
    conn = db.get_connection()
    cursor = conn.cursor()

    cursor.execute(f"""
        SELECT
            DATE(transaction_date) as date,
            type,
            COALESCE(SUM(amount), 0) as total
        FROM transactions
        WHERE user_id = ? AND status = 'completed'
            AND transaction_date >= date('now', '-{days} days')
        GROUP BY date, type
        ORDER BY date
    """, (current_user.id,))

    results = cursor.fetchall()
    conn.close()

    # Преобразование в формат для Recharts
    data_dict = {}
    for row in results:
        date = row['date']
        if date not in data_dict:
            data_dict[date] = {'date': date, 'income': 0, 'expense': 0}
        data_dict[date][row['type']] = round(row['total'], 2)

    return list(data_dict.values())

@router.get("/top-categories")
def get_top_categories(
    limit: int = Query(5, ge=1, le=20),
    type: Optional[str] = Query(None),
    current_user: UserResponse = Depends(get_current_user)
):
    conn = db.get_connection()
    cursor = conn.cursor()

    query = """
        SELECT
            pc.name as category,
            pc.color as color,
            pc.icon as icon,
            COUNT(t.id) as transaction_count,
            COALESCE(SUM(t.amount), 0) as total_amount
        FROM transactions t
        LEFT JOIN payment_categories pc ON t.category_id = pc.id
        WHERE t.user_id = ? AND t.status = 'completed'
    """
    params = [current_user.id]

    if type:
        query += " AND t.type = ?"
        params.append(type)

    query += """
        GROUP BY pc.name, pc.color, pc.icon
        ORDER BY total_amount DESC
        LIMIT ?
    """
    params.append(limit)

    cursor.execute(query, params)
    results = [dict(row) for row in cursor.fetchall()]
    conn.close()

    for item in results:
        item['total_amount'] = round(item['total_amount'], 2)

    return results

@router.get("/recent-activity")
def get_recent_activity(
    limit: int = Query(10, ge=1, le=100),
    current_user: UserResponse = Depends(get_current_user)
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
        WHERE t.user_id = ?
        ORDER BY t.created_at DESC
        LIMIT ?
    """, (current_user.id, limit))

    results = [dict(row) for row in cursor.fetchall()]
    conn.close()

    return results
