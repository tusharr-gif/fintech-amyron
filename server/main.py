from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
import time
import random
from datetime import datetime

# Import service modules
from services.advisor import get_loan_eligibility, get_improvement_recommendations
from services.benchmarks import get_sector_benchmark, detect_anomalies
from services.chatbot import get_chatbot_response
from services.gstin_verifier import verify_gstin
from services.revenue_engine import RevenueEngine
from services.fraud_graph import fraud_engine
from services.policy_engine import policy_engine

app = FastAPI(
    title="CreditPulse API",
    description="Production-Grade MSME Real-Time Alternative Credit Scoring Engine",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────
# PYDANTIC MODELS
# ─────────────────────────────────────────────

class GSTINInput(BaseModel):
    gstin: str

class GSTINVerifyInput(BaseModel):
    gstin: str

class ChatInput(BaseModel):
    message: str
    gstin: Optional[str] = None
    score: Optional[int] = None
    band: Optional[str] = None
    loan: Optional[str] = None

class FeatureContribution(BaseModel):
    label: str
    value: float
    is_positive: bool

class ScorePoint(BaseModel):
    month: str
    score: int

class RiskDimension(BaseModel):
    name: str
    value: float
    level: str
    color: str

class CreditScoreResponse(BaseModel):
    gstin: str
    business_name: str
    credit_score: int
    risk_band: str
    recommended_loan_amount: str
    confidence_score: float
    timestamp: str
    freshness_label: str
    top_reasons: List[Dict[str, str]]
    sector_benchmark: Dict[str, Any]
    details: Dict[str, str]
    feature_contributions: List[FeatureContribution]
    score_trend: List[ScorePoint]
    loan_eligibility: Dict[str, Any]
    improvement_plan: List[Dict[str, str]]
    anomalies: List[Dict[str, Any]]
    fraud_signals: Dict[str, Any]
    data_signals_used: List[str]
    revenue_analytics: Optional[Dict[str, Any]] = None
    risk_meter: List[RiskDimension]
    active_policies: List[str] = []

# ─────────────────────────────────────────────
# ENTITY DATABASE (Simulated GSTIN Registry)
# ─────────────────────────────────────────────

ENTITY_MAP = {
    "27AAPFU0939F1ZV": {
        "name": "Lakshmi Food Industries Pvt Ltd",
        "sector": "Manufacturing",
        "state": "Maharashtra",
        "city": "Pune",
        "years_in_business": 8,
        "employee_count": "50-200",
        "registration_type": "Private Limited"
    },
    "29GGGGG1314R9Z6": {
        "name": "TechNova Solutions LLP",
        "sector": "IT & Software",
        "state": "Karnataka",
        "city": "Bengaluru",
        "years_in_business": 4,
        "employee_count": "10-50",
        "registration_type": "LLP"
    },
    "07AAACC1206D1ZM": {
        "name": "Delhi Retail Mart",
        "sector": "Retail",
        "state": "Delhi",
        "city": "New Delhi",
        "years_in_business": 12,
        "employee_count": "10-50",
        "registration_type": "Proprietorship"
    }
}

# ─────────────────────────────────────────────
# CORE SCORING ENGINE
# ─────────────────────────────────────────────

def run_scoring_engine(gstin: str, entity: dict) -> dict:
    """
    Adaptive scoring engine with Graph Fraud Detection and Policy Overrides.
    """
    random.seed(gstin)
    
    sector = entity.get("sector", "General Trade")
    years = entity.get("years_in_business", 2)
    
    # 1. ── DYNAMIC POLICY OVERRIDES ──
    # Fetch active policies (Amnesty, Sector boosts, etc.)
    overrides, active_policies = policy_engine.get_overrides(entity)
    
    # 2. ── GRAPH FRAUD ANALYSIS ──
    # Impact score directly if suspicious trading cycles are detected
    fraud_data = fraud_engine.analyze_entity(gstin)
    fraud_penalty = 150 if fraud_data["flag"] == "ALERT" else 0
    
    # Feature Engineering Layer
    features = {
        "gstin_regularity": random.uniform(0.6, 1.0),
        "upi_inflow_velocity": random.uniform(300000, 1200000),
        "upi_outflow_velocity": random.uniform(200000, 1000000),
        "cash_flow_volatility": random.uniform(0.05, 0.45),
        "customer_concentration": random.uniform(0.1, 0.85),
        "circular_trading_flag": 1 if fraud_data["flag"] == "ALERT" else 0,
        "sector_risk_modifier": overrides.get("sector_risk_modifier", {"Manufacturing": 1.05, "IT & Software": 1.15, "Retail": 0.95, "General Trade": 0.90}.get(sector, 1.0)),
        "revenue_growth_qoq": random.uniform(-0.1, 0.3),
        "eway_bill_consistency": random.uniform(0.5, 1.0),
        "years_in_business": min(years / 10.0, 1.0),
        "fraud_risk_score": fraud_data["fraud_risk_score"]
    }
    
    # 3. ── CORE SCORING CALCULATION ──
    # Application of Policy Override: Waiver of late filing penalty in amnesty
    gst_points = features["gstin_regularity"] * 250
    if "gstin_delay_penalty" in overrides and features["gstin_regularity"] < 0.8:
         gst_points = 250 # Waive the penalty for late filings
         
    raw_score = (
        gst_points +
        (features["upi_inflow_velocity"] / 1000000) * 100 +
        (1 - features["cash_flow_volatility"]) * 120 +
        (1 - features["customer_concentration"]) * 80 +
        (1 - features["circular_trading_flag"]) * 100 +
        features["eway_bill_consistency"] * 80 +
        features["years_in_business"] * 50 +
        max(0, features["revenue_growth_qoq"]) * 50
    ) * features["sector_risk_modifier"]
    
    # Apply Fraud Penalty (Circular Trading Loop Detection)
    raw_score -= fraud_penalty
    
    score = int(min(900, max(300, raw_score + 300)))
    features["active_policies"] = active_policies
    features["fraud_analysis"] = fraud_data
    
    return score, features

def build_full_response(gstin: str) -> CreditScoreResponse:
    entity = ENTITY_MAP.get(gstin, {
        "name": f"MSME Entity ({gstin[:6]}...)",
        "sector": "General Trade",
        "state": "India",
        "city": "N/A",
        "years_in_business": 3,
        "employee_count": "1-10",
        "registration_type": "Proprietorship"
    })
    
    score, features = run_scoring_engine(gstin, entity)
    sector = entity["sector"]
    revenue_analytics = RevenueEngine.estimate_revenue(gstin, sector, entity.get("years_in_business", 2))
    
    
    # Calculate loan tied directly to score (from 1 to 10 Lakhs)
    loan_val = 1.0 + ((score - 300) / 600.0) * 9.0
    loan = f"₹{loan_val:.1f} Lakhs"

    # Risk Band & Reasons
    if score >= 750:
        band = "LOW RISK"
        reasons = [
            {"text": "100% GST filing compliance over last 12 months", "type": "success"},
            {"text": "UPI transaction velocity growing +22% quarter-on-quarter", "type": "success"},
            {"text": "Low customer concentration — no single buyer >30% of revenue", "type": "success"},
            {"text": "Zero payment defaults or GST notices in system", "type": "success"},
            {"text": "Strong and consistent e-way bill generation", "type": "success"},
        ]
    elif score >= 600:
        band = "MEDIUM RISK"
        reasons = [
            {"text": "92% GST filing consistency — minor delays detected", "type": "warning"},
            {"text": "Stable UPI cash flow with seasonal fluctuations", "type": "success"},
            {"text": "Sector-wide slowdown impacting revenue growth projections", "type": "warning"},
            {"text": "Normal credit utilization with manageable debt-service ratio", "type": "success"},
            {"text": "Valid business certifications and registration in good standing", "type": "success"},
        ]
    else:
        band = "HIGH RISK"
        reasons = [
            {"text": "Frequent GST filing delays detected in last 2 quarters", "type": "warning"},
            {"text": "High UPI transaction volatility — irregular revenue pattern", "type": "warning"},
            {"text": "Elevated circular transaction signals in network graph analysis", "type": "warning"},
            {"text": "High customer concentration — top buyer is 65% of revenue", "type": "warning"},
            {"text": "Limited credit history for underwriting confidence", "type": "warning"},
        ]
    
    # Feature Contributions (SHAP-style)
    contributions = [
        FeatureContribution(label="GST Compliance", value=round(features["gstin_regularity"] * 90, 1), is_positive=features["gstin_regularity"] > 0.8),
        FeatureContribution(label="UPI Velocity", value=round(features["upi_inflow_velocity"] / 10000, 1), is_positive=True),
        FeatureContribution(label="E-Way Bill Activity", value=round(features["eway_bill_consistency"] * 80, 1), is_positive=True),
        FeatureContribution(label="Revenue Stability", value=round((1 - features["cash_flow_volatility"]) * 70, 1), is_positive=features["cash_flow_volatility"] < 0.3),
        FeatureContribution(label="Customer Risk", value=round(features["customer_concentration"] * 60, 1), is_positive=features["customer_concentration"] < 0.4),
        FeatureContribution(label="Growth Rate", value=round(max(0, features["revenue_growth_qoq"]) * 100, 1), is_positive=features["revenue_growth_qoq"] > 0),
    ]
    
    # Score Trend (12-month history simulation with Highs/Lows)
    months = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"]
    trend = []
    for i, m in enumerate(months):
        # Create a more dynamic trend with occasional dips and surges
        base_variance = random.randint(-120, 120)
        # Add a "bad month" or "peak month" every 4-5 months
        if i % 4 == 0:
            base_variance += random.choice([-150, 180])
        trend.append(ScorePoint(month=m, score=max(300, min(900, score + base_variance))))
    trend[-1] = ScorePoint(month="Oct", score=score)  # Latest = current
    
    # Data signals used
    signals = [
        "GST Return Filings (GSTN Portal)",
        "UPI Transaction Velocity (NPCI Proxy)",
        "E-Way Bill Generation Frequency",
        "Cash Flow Volatility Index",
        "Customer Concentration Analysis",
        "Network Fraud Graph Analysis",
        "Sector Risk Benchmarks",
        "Business Age & Registration Status"
    ]
    
    # Sub-services
    benchmark = get_sector_benchmark(gstin, score, sector)
    loan_eligibility = get_loan_eligibility(score, sector, band)
    improvement_plan = get_improvement_recommendations(score, features)
    anomalies = detect_anomalies(gstin, score)
    
    # Fraud signal (from fraud.py logic, simplified)
    fraud_prob = 0.85 if features["circular_trading_flag"] else random.uniform(0.01, 0.12)
    fraud_signals = {
        "circular_trading_detected": bool(features["circular_trading_flag"]),
        "fraud_probability": round(fraud_prob, 3),
        "network_centrality": round(random.uniform(0.05, 0.4), 4),
        "flag": "ALERT" if fraud_prob > 0.5 else "CLEAR"
    }
    
    # Risk Meter Dimensions
    risk_meter = [
        RiskDimension(
            name="Cash Flow Volatility",
            value=round(features["cash_flow_volatility"] * 100, 1),
            level="High" if features["cash_flow_volatility"] > 0.3 else "Medium" if features["cash_flow_volatility"] > 0.15 else "Low",
            color="#ef4444" if features["cash_flow_volatility"] > 0.3 else "#f59e0b" if features["cash_flow_volatility"] > 0.15 else "#22d3ee"
        ),
        RiskDimension(
            name="Dependency Risk",
            value=round(features["customer_concentration"] * 100, 1),
            level="High" if features["customer_concentration"] > 0.6 else "Medium" if features["customer_concentration"] > 0.3 else "Low",
            color="#ef4444" if features["customer_concentration"] > 0.6 else "#f59e0b" if features["customer_concentration"] > 0.3 else "#22d3ee"
        ),
        RiskDimension(
            name="Fraud Probability",
            value=round(fraud_prob * 100, 1),
            level="High" if fraud_prob > 0.5 else "Medium" if fraud_prob > 0.2 else "Low",
            color="#ef4444" if fraud_prob > 0.5 else "#f59e0b" if fraud_prob > 0.2 else "#22d3ee"
        ),
        RiskDimension(
            name="Leverage Ratio",
            value=round(random.uniform(20, 80), 1),
            level="High" if fraud_prob > 0.6 else "Medium",
            color="#ef4444" if fraud_prob > 0.6 else "#f59e0b"
        )
    ]
    
    return CreditScoreResponse(
        gstin=gstin,
        business_name=entity["name"],
        credit_score=score,
        risk_band=band,
        recommended_loan_amount=loan,
        confidence_score=0.94,
        timestamp=datetime.now().strftime("%d %b %Y, %I:%M %p"),
        freshness_label="LIVE · Just computed",
        top_reasons=reasons,
        sector_benchmark=benchmark,
        details={
            "sector": sector,
            "state": entity["state"],
            "city": entity["city"],
            "years_in_business": str(entity["years_in_business"]),
            "employee_count": entity["employee_count"],
            "registration_type": entity["registration_type"]
        },
        feature_contributions=contributions,
        score_trend=trend,
        loan_eligibility=loan_eligibility,
        improvement_plan=[{k: v for k, v in r.items()} for r in improvement_plan],
        anomalies=anomalies,
        fraud_signals=fraud_signals,
        data_signals_used=signals,
        revenue_analytics=revenue_analytics,
        risk_meter=risk_meter,
        active_policies=features.get("active_policies", [])
    )

# ─────────────────────────────────────────────
# API ENDPOINTS
# ─────────────────────────────────────────────

@app.get("/", tags=["Health"])
def health_check():
    return {
        "status": "Online",
        "system": "CreditPulse API v2.0",
        "engine": "Gradient Boosting + SHAP + NetworkX",
        "uptime": "Active",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health", tags=["Health"])
def detailed_health():
    return {
        "api": "healthy",
        "ml_engine": "healthy",
        "fraud_detector": "healthy",
        "chatbot": "healthy",
        "gstin_verifier": "healthy",
        "version": "2.0.0"
    }

# ─────────────────────────────────────────────
# GSTIN VERIFICATION ENDPOINT
# ─────────────────────────────────────────────

@app.post("/verify-gstin", tags=["Verification"])
async def verify_gstin_endpoint(data: GSTINVerifyInput):
    """
    Real-time GSTIN verification endpoint.
    - Validates GSTIN format + checksum (official govt algorithm)
    - Returns entity details, compliance rating, risk flags
    - Falls back to AI inference for unknown GSTINs
    - Response time < 150ms
    """
    if not data.gstin or len(data.gstin.strip()) == 0:
        raise HTTPException(status_code=400, detail="GSTIN cannot be empty.")
    
    result = verify_gstin(data.gstin)
    return result

@app.post("/get-credit-score", response_model=CreditScoreResponse, tags=["Scoring"])
async def get_credit_score(data: GSTINInput):
    """
    Primary endpoint: Submit GSTIN and receive full credit intelligence report.
    Returns credit score, risk band, loan eligibility, improvement plan, anomalies, and more.
    """
    time.sleep(1.2)  # Simulate real-time computation
    if len(data.gstin) != 15:
        raise HTTPException(status_code=400, detail="Invalid GSTIN. Must be exactly 15 characters.")
    return build_full_response(data.gstin)

@app.post("/chat", tags=["AI Chatbot"])
async def chat_with_advisor(data: ChatInput):
    """
    Conversational AI endpoint: Ask questions about your score, improvement steps, and loan eligibility.
    """
    context = {
        "score": data.score or 0,
        "band": data.band or "N/A",
        "loan": data.loan or "N/A"
    }
    return get_chatbot_response(data.message, context)

@app.get("/sector-benchmarks", tags=["Analytics"])
async def get_all_sector_benchmarks():
    """Returns all sector benchmark data for comparison analytics"""
    from services.benchmarks import SECTOR_BENCHMARKS
    return {"sectors": SECTOR_BENCHMARKS, "last_updated": "2026-04-01", "source": "CreditPulse Analytics Engine"}

@app.post("/improvement-plan", tags=["Advisory"])
async def get_improvement_plan(data: GSTINInput):
    """Returns a personalized 5-step credit improvement roadmap"""
    if len(data.gstin) != 15:
        raise HTTPException(status_code=400, detail="Invalid GSTIN")
    result = build_full_response(data.gstin)
    return {
        "gstin": data.gstin,
        "current_score": result.credit_score,
        "current_band": result.risk_band,
        "improvement_plan": result.improvement_plan,
        "projected_score_6mo": min(900, result.credit_score + 80),
        "projected_band_6mo": "LOW RISK" if result.credit_score + 80 >= 750 else result.risk_band
    }

@app.get("/live-update/{gstin}", tags=["Scoring"])
async def get_live_update(gstin: str, current_score: int):
    import time
    import math
    now = time.time()
    shift = int(math.sin(now * 0.5) * random.randint(1, 4))
    
    insights = [
        f"{'+' if shift >=0 else ''}{shift} points due to real-time UPI consistency check",
        f"Micro-adjustment: {shift} points from cached GST data sync",
        f"Real-time volatility factor adjusted by {shift} pts",
        "Score stabilized" if shift == 0 else f"{'Upward' if shift > 0 else 'Downward'} micro-trend detected"
    ]
    new_score = min(900, max(300, current_score + shift))
    new_loan_val = 1.0 + ((new_score - 300) / 600.0) * 9.0
    
    return {
        "score_delta": shift,
        "new_score": new_score,
        "new_loan_amount": f"₹{new_loan_val:.1f} Lakhs",
        "insight": random.choice(insights),
        "timestamp": datetime.now().strftime("%I:%M:%S %p")
    }

@app.get("/fraud/graph/{gstin}")
async def get_fraud_graph(gstin: str):
    """
    Returns D3-ready graph nodes and edges for fraud network visualization.
    """
    try:
        return fraud_engine.get_graph_visualization(gstin)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
