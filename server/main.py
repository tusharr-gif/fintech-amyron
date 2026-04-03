from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import time
import random
from datetime import datetime

app = FastAPI(title="CreditPulse API", description="MSME Real-Time Credit Scoring Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FeatureContribution(BaseModel):
    label: str
    value: float
    is_positive: bool

class ScorePoint(BaseModel):
    month: str
    score: int

class CreditScoreResponse(BaseModel):
    gstin: str
    business_name: str
    credit_score: int
    risk_band: str
    recommended_loan_amount: str
    confidence_score: float
    timestamp: str
    top_reasons: List[Dict[str, str]]  # Changed to Dict for type and text
    sector_benchmark: Dict[str, float]
    details: Dict[str, str]
    feature_contributions: List[FeatureContribution]
    score_trend: List[ScorePoint]

class GSTINInput(BaseModel):
    gstin: str

ENTITY_MAP = {
    "27AAPFU0939F1ZV": {"name": "Lakshmi Food Industries", "sector": "Manufacturing", "state": "Maharashtra"},
    "29GGGGG1314R9Z6": {"name": "TechNova Solutions", "sector": "IT & Software", "state": "Karnataka"},
    "07AAACC1206D1ZM": {"name": "Delhi Retail Mart", "sector": "Retail", "state": "Delhi"}
}

def calculate_score_details(gstin: str) -> CreditScoreResponse:
    entity = ENTITY_MAP.get(gstin, {"name": f"MSME Entity {gstin[:4]}", "sector": "General Trade", "state": "India"})
    random.seed(gstin)
    score = random.randint(450, 850)
    
    if score >= 750:
        band, loan = "LOW RISK", f"₹{random.randint(15, 30) * 10} Lakhs"
        reasons = [
            {"text": "100% GST filing consistency.", "type": "success"},
            {"text": "UPI velocity +22% in Q3.", "type": "success"},
            {"text": "Low customer concentration.", "type": "success"},
            {"text": "Zero payment defaults.", "type": "success"},
            {"text": "Strong social sentiment.", "type": "success"}
        ]
    elif score >= 600:
        band, loan = "MEDIUM RISK", f"₹{random.randint(5, 15) * 10} Lakhs"
        reasons = [
            {"text": "92% GST filing consistency.", "type": "success"},
            {"text": "Stable cash flow patterns.", "type": "success"},
            {"text": "Sector-wide slowdown impact.", "type": "warning"},
            {"text": "Normal credit utilization.", "type": "success"},
            {"text": "Valid professional certifications.", "type": "success"}
        ]
    else:
        band, loan = "HIGH RISK", f"₹{random.randint(2, 5) * 10} Lakhs"
        reasons = [
            {"text": "Frequent GST filing delays.", "type": "warning"},
            {"text": "High UPI transaction volatility.", "type": "warning"},
            {"text": "Circular trading signals detected.", "type": "warning"},
            {"text": "Low balance maintenance.", "type": "warning"},
            {"text": "Limited sector history.", "type": "success"}
        ]

    contributions = [
        FeatureContribution(label="Gst Compliance", value=random.randint(40, 90), is_positive=True),
        FeatureContribution(label="Upi Velocity", value=random.randint(20, 50), is_positive=True),
        FeatureContribution(label="E Way Bill Activ...", value=random.randint(15, 40), is_positive=True),
        FeatureContribution(label="Revenue Stability", value=random.randint(10, 35), is_positive=score < 600),
        FeatureContribution(label="Growth Rate", value=random.randint(10, 30), is_positive=True),
        FeatureContribution(label="Digital Presence", value=random.randint(5, 20), is_positive=True),
    ]

    months = ["May", "Jul", "Sep", "Nov", "Jan", "Apr"]
    trend = [ScorePoint(month=m, score=score + random.randint(-50, 50)) for m in months]

    return CreditScoreResponse(
        gstin=gstin, business_name=entity["name"], credit_score=score, risk_band=band,
        recommended_loan_amount=loan, confidence_score=0.92,
        timestamp=datetime.now().strftime("%d %b %Y, %I:%M %p"),
        top_reasons=reasons,
        sector_benchmark={"sector_average": 630.0, "percentile": float(random.randint(40, 95)) if score > 630 else float(random.randint(10, 40)), "points_diff": float(score - 630)},
        details=entity,
        feature_contributions=contributions,
        score_trend=trend
    )

@app.get("/")
def read_root(): return {"status": "Online"}

@app.post("/get-credit-score", response_model=CreditScoreResponse)
async def get_credit_score(data: GSTINInput):
    time.sleep(1.5)
    if len(data.gstin) != 15: raise HTTPException(status_code=400, detail="Invalid GSTIN")
    return calculate_score_details(data.gstin)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
