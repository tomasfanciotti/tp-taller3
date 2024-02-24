from pydantic import BaseModel

def ResponseModel(data, message):
    return {
        "data": data,
        "code": 200,
        "message": message,
    }

class Token(BaseModel):
    access_token: str
    token_type: str
