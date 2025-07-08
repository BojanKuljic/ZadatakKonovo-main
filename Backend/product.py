from fastapi import APIRouter, HTTPException
from auth import get_jwt_token
import httpx
import re

router = APIRouter()

EXTERNAL_API_BASE = "https://zadatak.konovo.rs"

# Metoda za zamenu stringa "brzina" sa "performanse" case-insensitive 
def process_product(product):
    
    if "description" in product and product["description"]:
        pattern = re.compile(r"brzina", re.IGNORECASE)
        product["description"] = pattern.sub("performanse", product["description"])

    # Dodavanje nove cene za monitore
    if str(product.get("categoryName", "")).lower() == "monitori":
        try:
            product["newPrice"] = round(float(product["price"]) * 1.10, 2)
        except Exception:
            product["newPrice"] = product.get("price")

    return product



#Korigovanje Cene Monitora (Zadrzana stara cena i dodato polje NewPrice radi lakse evidencije Funkcionalnosti )
@router.get("/products/monitors")
async def get_monitors():
    token = await get_jwt_token()
    headers = {"Authorization": f"Bearer {token}"}

    async with httpx.AsyncClient() as client:
        response = await client.get(f"{EXTERNAL_API_BASE}/products", headers=headers)

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch products")

    products = response.json()

    # Filtriraj monitore i procesuiraj svaki
    monitors = [
        process_product(product)
        for product in products
        if str(product.get("categoryName", "")).lower() == "monitori"
    ]

    return monitors


# Dohvatanje svih proizvoda (GET/Products)
@router.get("/products")
async def get_products(category: str = "", search: str = ""):
    token = await get_jwt_token()
    headers = {"Authorization": f"Bearer {token}"}

    async with httpx.AsyncClient() as client:
        response = await client.get(f"{EXTERNAL_API_BASE}/products", headers=headers)

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch products")

    products = response.json()
    processed = [process_product(p) for p in products]

    if category:
        processed = [p for p in processed if str(p.get("categoryName", "")).lower() == category.lower()]

    if search:
        processed = [p for p in processed if search.lower() in p.get("naziv","").lower()]

    return processed


# Dohvatanje pojedinačnih proizvoda po ID (sif_product):
@router.get("/products/{product_id}")
async def get_product_by_id(product_id: int):
    token = await get_jwt_token()
    headers = {"Authorization": f"Bearer {token}"}

    async with httpx.AsyncClient() as client:
        response = await client.get(f"{EXTERNAL_API_BASE}/products", headers=headers)

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch products")

    products = response.json()

    for product in products:
        try:
            if int(product.get("sif_product", -1)) == product_id:
                return process_product(product)
        except ValueError:
            continue

    raise HTTPException(status_code=404, detail=f"Product with ID {product_id} not found")

