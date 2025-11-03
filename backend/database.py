import sqlite3
from datetime import datetime

class Database:
    def __init__(self, db_name: str = "database.db"):
        self.db_name = db_name
        self.init_database()

    def get_connection(self):
        conn = sqlite3.connect(self.db_name)
        conn.row_factory = sqlite3.Row
        return conn

    def init_database(self):
        conn = self.get_connection()
        cursor = conn.cursor()

        # ОБЯЗАТЕЛЬНО: Таблица users (НЕ ИЗМЕНЯТЬ!)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_active BOOLEAN DEFAULT 1
            )
        ''')

        # ОБЯЗАТЕЛЬНО: Таблица sessions (НЕ ИЗМЕНЯТЬ!)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
        ''')

        # ОБЯЗАТЕЛЬНО: Создать дефолтного админа (НЕ ИЗМЕНЯТЬ!)
        cursor.execute('''
            INSERT OR IGNORE INTO users (id, username, email, password, role)
            VALUES (1, 'admin', 'admin@admin.com', 'admin123', 'admin')
        ''')

        # Таблица категорий платежей
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS payment_categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL,
                description TEXT,
                color TEXT DEFAULT '#1976d2',
                icon TEXT DEFAULT 'payment',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # Таблица транзакций
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                category_id INTEGER,
                type TEXT NOT NULL CHECK(type IN ('income', 'expense', 'transfer')),
                amount REAL NOT NULL CHECK(amount > 0),
                currency TEXT DEFAULT 'USD',
                status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'completed', 'failed', 'cancelled')),
                description TEXT,
                recipient TEXT,
                sender TEXT,
                transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
                FOREIGN KEY (category_id) REFERENCES payment_categories (id) ON DELETE SET NULL
            )
        ''')

        # Таблица истории изменений транзакций
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS transaction_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                transaction_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                action TEXT NOT NULL,
                old_status TEXT,
                new_status TEXT,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (transaction_id) REFERENCES transactions (id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
        ''')

        # Вставка дефолтных категорий
        default_categories = [
            ('Зарплата', 'Доход от работы', '#4caf50', 'work'),
            ('Продажи', 'Доход от продаж товаров/услуг', '#2e7d32', 'store'),
            ('Продукты', 'Покупка продуктов питания', '#f44336', 'shopping_cart'),
            ('Транспорт', 'Расходы на транспорт', '#ff9800', 'directions_car'),
            ('Коммунальные услуги', 'Оплата коммунальных платежей', '#9c27b0', 'home'),
            ('Развлечения', 'Расходы на досуг и развлечения', '#e91e63', 'movie'),
            ('Здоровье', 'Медицинские расходы', '#00bcd4', 'local_hospital'),
            ('Образование', 'Расходы на обучение', '#3f51b5', 'school'),
            ('Переводы', 'Денежные переводы', '#607d8b', 'sync_alt'),
            ('Прочее', 'Прочие расходы', '#9e9e9e', 'category')
        ]

        for cat in default_categories:
            cursor.execute('''
                INSERT OR IGNORE INTO payment_categories (name, description, color, icon)
                VALUES (?, ?, ?, ?)
            ''', cat)

        conn.commit()
        conn.close()

db = Database()
