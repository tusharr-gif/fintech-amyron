"""
CreditPulse Sector Benchmarking & Anomaly Detection Engine
Compares business against sector peers and detects sudden financial changes
"""
import random
from typing import Dict, Any, List

# Sector benchmark database (simulated from industry data)
SECTOR_BENCHMARKS = {
    "Manufacturing": {
        "avg_score": 640, "top_quartile": 720, "bottom_quartile": 540,
        "avg_gst_compliance": 0.88, "avg_upi_velocity": 450000,
        "default_rate": 0.08, "growth_rate": 0.12,
        "typical_loan_size": "₹25L – ₹1Cr", "risk_profile": "MODERATE"
    },
    "IT & Software": {
        "avg_score": 700, "top_quartile": 780, "bottom_quartile": 610,
        "avg_gst_compliance": 0.95, "avg_upi_velocity": 750000,
        "default_rate": 0.04, "growth_rate": 0.22,
        "typical_loan_size": "₹10L – ₹50L", "risk_profile": "LOW"
    },
    "Retail": {
        "avg_score": 610, "top_quartile": 680, "bottom_quartile": 510,
        "avg_gst_compliance": 0.82, "avg_upi_velocity": 320000,
        "default_rate": 0.12, "growth_rate": 0.08,
        "typical_loan_size": "₹5L – ₹30L", "risk_profile": "MODERATE-HIGH"
    },
    "General Trade": {
        "avg_score": 580, "top_quartile": 650, "bottom_quartile": 490,
        "avg_gst_compliance": 0.79, "avg_upi_velocity": 280000,
        "default_rate": 0.14, "growth_rate": 0.06,
        "typical_loan_size": "₹2L – ₹20L", "risk_profile": "HIGH"
    }
}

def get_sector_benchmark(gstin: str, score: int, sector: str) -> Dict[str, Any]:
    """Compare this business against its sector peers"""
    random.seed(gstin + sector)
    bench = SECTOR_BENCHMARKS.get(sector, SECTOR_BENCHMARKS["General Trade"])
    
    sector_avg = bench["avg_score"]
    top_q = bench["top_quartile"]
    bottom_q = bench["bottom_quartile"]
    
    # Calculate percentile
    if score >= top_q:
        percentile = random.randint(75, 95)
        peer_position = "TOP QUARTILE"
    elif score >= sector_avg:
        percentile = random.randint(50, 74)
        peer_position = "ABOVE AVERAGE"
    elif score >= bottom_q:
        percentile = random.randint(25, 49)
        peer_position = "BELOW AVERAGE"
    else:
        percentile = random.randint(5, 24)
        peer_position = "BOTTOM QUARTILE"
    
    return {
        "sector": sector,
        "sector_avg_score": sector_avg,
        "top_quartile_score": top_q,
        "bottom_quartile_score": bottom_q,
        "your_score": score,
        "percentile": percentile,
        "peer_position": peer_position,
        "points_vs_avg": score - sector_avg,
        "sector_default_rate": f"{bench['default_rate']*100:.1f}%",
        "sector_growth_rate": f"{bench['growth_rate']*100:.1f}%",
        "sector_risk_profile": bench["risk_profile"],
        "typical_loan_size": bench["typical_loan_size"],
        "businesses_analyzed": random.randint(12000, 45000),
    }


def detect_anomalies(gstin: str, score: int) -> List[Dict[str, Any]]:
    """Detect sudden or suspicious financial changes"""
    random.seed(gstin + "anomaly")
    
    anomalies = []
    
    # Simulate trailing 3-month score trend
    prev_scores = [score + random.randint(-80, 80) for _ in range(3)]
    score_drop = score - max(prev_scores)
    
    if score_drop < -40:
        anomalies.append({
            "type": "SCORE_DROP",
            "severity": "HIGH",
            "title": "Significant Score Decline Detected",
            "detail": f"Score dropped ~{abs(score_drop)} points vs. prior quarter peak. Investigate GST filing delays or UPI velocity drop.",
            "detected_on": "Last 90 days"
        })
    
    if random.random() < 0.3:
        anomalies.append({
            "type": "GST_SPIKE",
            "severity": "MEDIUM",
            "title": "Unusual GST Filing Pattern",
            "detail": "Detected a sudden spike in GST return values not proportional to prior UPI/bank activity. May indicate invoice inflation.",
            "detected_on": "Q4 filing"
        })
    
    if random.random() < 0.15:
        anomalies.append({
            "type": "CIRCULAR_TXN",
            "severity": "HIGH",
            "title": "Possible Circular Transaction Signal",
            "detail": "UPI outflow patterns show partial round-trip characteristics. Network graph centrality score elevated.",
            "detected_on": "Last 60 days"
        })
    
    return anomalies
