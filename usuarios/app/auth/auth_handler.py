import os
import jwt
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("secret")
ALGORITHM = os.getenv("algorithm")

def create_access_token(user_id: str, email: str, telegram_id: str):
    to_encode = {
        "user_id": str(user_id),
        "email": email,
        "telegram_id": telegram_id,
    }
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token_access(token: str):
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    return payload.get("user_id")
