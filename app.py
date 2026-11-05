import uvicorn
import os
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse, FileResponse, Response
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from starlette.responses import PlainTextResponse
from datetime import date

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = FastAPI(title="Bijective Base-6 Calculator & Explorer")

# Static assets mounts (resolved relative to BASE_DIR for directory independence)
static_dir = os.path.join(BASE_DIR, "static")
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")
assets_dir = os.path.join(BASE_DIR, "assets")
if os.path.exists(assets_dir):
    app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")
locales_dir = os.path.join(BASE_DIR, "locales")
if os.path.exists(locales_dir):
    app.mount("/locales", StaticFiles(directory=locales_dir), name="locales")

# Core Bijective Base-6 conversion logic
def to_bijective_base6(n: int) -> str:
    if n <= 0:
        return "(N/A)"
    chars = "123456"
    result = []
    while n > 0:
        n, remainder = divmod(n - 1, 6)
        result.append(chars[remainder])
    return "".join(reversed(result))

def from_bijective_base6(s: str) -> int:
    if not s or not all(c in "123456" for c in s.strip()):
        raise ValueError("Invalid bijective base-6 input. Digits must be 1 to 6.")
    n = 0
    for c in s.strip():
        n = n * 6 + int(c)
    return n

# Pydantic schemas for API testing compatibility
class ConvertRequest(BaseModel):
    decimal_value: int

class CalculateRequest(BaseModel):
    num1: str
    num2: str

@app.get("/")
async def read_root():
    idx1 = os.path.join(BASE_DIR, "index.html")
    idx2 = os.path.join(BASE_DIR, "templates", "index.html")
    if os.path.exists(idx1):
        return FileResponse(idx1)
    elif os.path.exists(idx2):
        return FileResponse(idx2)
    return HTMLResponse("<h1>Bijective Base-6 Calculator</h1>")

@app.get("/robots.txt", response_class=PlainTextResponse)
def robots():
    robots_path = os.path.join(BASE_DIR, "robots.txt")
    if os.path.exists(robots_path):
        with open(robots_path, "r", encoding="utf-8") as f:
            return f.read()
    return "# For all crawlers\nUser-agent: *\nDisallow:\n"

@app.get("/sitemap.xml")
def sitemap():
    sitemap_path = os.path.join(BASE_DIR, "sitemap.xml")
    if os.path.exists(sitemap_path):
        with open(sitemap_path, "r", encoding="utf-8") as f:
            return Response(content=f.read(), media_type="application/xml")
    return Response(content="<urlset></urlset>", media_type="application/xml")

@app.get("/site.webmanifest")
def webmanifest():
    manifest_path = os.path.join(BASE_DIR, "site.webmanifest")
    if os.path.exists(manifest_path):
        return FileResponse(manifest_path, media_type="application/manifest+json")
    raise HTTPException(status_code=404, detail="Manifest not found")

@app.get("/locales/{lang}.json")
async def get_locale(lang: str):
    if not lang.replace("-", "").isalnum():
        raise HTTPException(status_code=400, detail="Invalid language format")
    file_path = os.path.join(BASE_DIR, "locales", f"{lang}.json")
    if os.path.exists(file_path):
        return FileResponse(file_path)
    raise HTTPException(status_code=404, detail="Language not found")

@app.get("/get-tables")
async def get_tables():
    table_size = 24
    header = [to_bijective_base6(i) for i in range(1, table_size + 1)]
    add_table = [[to_bijective_base6(i + j) for j in range(1, table_size + 1)] for i in range(1, table_size + 1)]
    mul_table = [[to_bijective_base6(i * j) for j in range(1, table_size + 1)] for i in range(1, table_size + 1)]
    return {"header": header, "addition": add_table, "multiplication": mul_table}

@app.post("/convert")
async def convert_endpoint(req: ConvertRequest):
    val = req.decimal_value
    return {
        "decimal": val,
        "bijective_base6": to_bijective_base6(val),
        "binary": bin(val)[2:],
        "hexadecimal": hex(val)[2:].upper()
    }

@app.post("/calculate-all")
async def calculate_all_endpoint(req: CalculateRequest):
    try:
        n1 = from_bijective_base6(req.num1)
        n2 = from_bijective_base6(req.num2)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    add_dec = n1 + n2
    sub_dec = n1 - n2
    mul_dec = n1 * n2
    div_dec = n1 // n2 if n2 != 0 else 0
    rem_dec = n1 % n2 if n2 != 0 else 0

    return {
        "results": {
            "addition": {"decimal": add_dec, "bijective": to_bijective_base6(add_dec)},
            "subtraction": {"decimal": sub_dec, "bijective": to_bijective_base6(sub_dec) if sub_dec > 0 else "(N/A)"},
            "multiplication": {"decimal": mul_dec, "bijective": to_bijective_base6(mul_dec)},
            "division": {
                "decimal": div_dec,
                "remainder": rem_dec,
                "bijective": to_bijective_base6(div_dec) if div_dec > 0 else "(N/A)"
            }
        }
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
