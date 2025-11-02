from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Literal
from datetime import datetime

# ОБЯЗАТЕЛЬНЫЕ МОДЕЛИ (НЕ ИЗМЕНЯТЬ!)
class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str
    created_at: str
    is_active: bool

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[Literal['user', 'admin']] = None
    is_active: Optional[bool] = None

# СПЕЦИФИЧНЫЕ МОДЕЛИ ДЛЯ ПЛАТЕЖНЫХ ТРАНЗАКЦИЙ

class PaymentCategoryCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    color: str = Field(default='#1976d2')
    icon: str = Field(default='payment')

class PaymentCategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    color: Optional[str] = None
    icon: Optional[str] = None

class PaymentCategoryResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    color: str
    icon: str
    created_at: str

class TransactionCreate(BaseModel):
    category_id: Optional[int] = None
    type: Literal['income', 'expense', 'transfer']
    amount: float = Field(..., gt=0)
    currency: str = Field(default='USD')
    description: Optional[str] = None
    recipient: Optional[str] = None
    sender: Optional[str] = None
    transaction_date: Optional[str] = None

class TransactionUpdate(BaseModel):
    category_id: Optional[int] = None
    type: Optional[Literal['income', 'expense', 'transfer']] = None
    amount: Optional[float] = Field(None, gt=0)
    currency: Optional[str] = None
    status: Optional[Literal['pending', 'completed', 'failed', 'cancelled']] = None
    description: Optional[str] = None
    recipient: Optional[str] = None
    sender: Optional[str] = None
    transaction_date: Optional[str] = None

class TransactionResponse(BaseModel):
    id: int
    user_id: int
    category_id: Optional[int]
    type: str
    amount: float
    currency: str
    status: str
    description: Optional[str]
    recipient: Optional[str]
    sender: Optional[str]
    transaction_date: str
    created_at: str
    updated_at: str

class TransactionWithCategory(TransactionResponse):
    category_name: Optional[str] = None
    category_color: Optional[str] = None
    category_icon: Optional[str] = None

class TransactionHistoryResponse(BaseModel):
    id: int
    transaction_id: int
    user_id: int
    action: str
    old_status: Optional[str]
    new_status: Optional[str]
    notes: Optional[str]
    created_at: str

class StatsResponse(BaseModel):
    total_transactions: int
    total_income: float
    total_expense: float
    balance: float
    pending_count: int
    completed_count: int
    failed_count: int
    cancelled_count: int
