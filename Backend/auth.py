import httpx
from fastapi import HTTPException

EXTERNAL_API_BASE = "https://zadatak.konovo.rs"
EXTERNAL_USERNAME = "zadatak"
EXTERNAL_PASSWORD = "zadatak"

jwt_token = None  # Globalni token cache

async def get_jwt_token():
    global jwt_token
    if jwt_token:
        return jwt_token
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{EXTERNAL_API_BASE}/login",
            json={"username": EXTERNAL_USERNAME, "password": EXTERNAL_PASSWORD}
        )

        print("Login status:", response.status_code)
        print("Login response:", response.text)

        if response.status_code == 200:
            jwt_token = response.json().get("token")
            if not jwt_token:
                raise HTTPException(status_code=500, detail="Token is missing in login response.")
            return jwt_token
        else:
            raise HTTPException(status_code=401, detail="Login to external API failed")
