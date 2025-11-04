from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt, ExpiredSignatureError, JWTClaimsError
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
from dotenv import load_dotenv
import traceback

load_dotenv()

# Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))  # 7 days

# Password hashing (using argon2 for Python 3.14+ compatibility)
pwd_context = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")

# Bearer token scheme
security = HTTPBearer()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    print(f"🔐 Creating token with:")
    print(f"   Data: {to_encode}")
    print(f"   Algorithm: {ALGORITHM}")
    print(f"   SECRET_KEY (first 20 chars): {SECRET_KEY[:20]}...")

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    print(f"✅ Token created: {encoded_jwt[:50]}...")
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    """Decode and verify a JWT token"""
    try:
        print(f"🔓 Attempting to decode token...")
        print(f"   Algorithm: {ALGORITHM}")
        print(f"   SECRET_KEY (first 20 chars): {SECRET_KEY[:20]}...")

        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(f"✅ Token decoded successfully: {payload}")
        return payload
    except ExpiredSignatureError as e:
        print(f"⏰ Token expired: {e}")
        return None
    except JWTClaimsError as e:
        print(f"⚠️ JWT Claims Error: {e}")
        return None
    except JWTError as e:
        print(f"❌ JWT Error: {e}")
        print(f"   Error type: {type(e).__name__}")
        return None
    except Exception as e:
        print(f"💥 Unexpected error decoding token: {e}")
        print(f"   Error type: {type(e).__name__}")
        print(traceback.format_exc())
        return None

def get_current_user_from_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Dependency to get current user from JWT token"""
    from database import db

    token = credentials.credentials
    print(f"🔍 Validating token: {token[:50]}...")

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = decode_access_token(token)
        print(f"📦 Token payload: {payload}")

        if payload is None:
            print("❌ Token decode returned None")
            raise credentials_exception

        user_id: int = payload.get("sub")
        print(f"👤 User ID from token: {user_id}")

        if user_id is None:
            print("❌ No 'sub' in payload")
            raise credentials_exception

        # Get user from database
        conn = db.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE id = ? AND is_active = 1", (user_id,))
        user = cursor.fetchone()
        conn.close()

        if user is None:
            print(f"❌ No user found with id={user_id}")
            raise credentials_exception

        print(f"✅ User authenticated: {user['username']}")
        return dict(user)
    except Exception as e:
        print(f"💥 Exception in token validation: {e}")
        print(traceback.format_exc())
        raise credentials_exception
