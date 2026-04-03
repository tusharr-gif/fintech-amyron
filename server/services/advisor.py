"""
CreditPulse AI Loan Advisor & Credit Improvement Engine
Provides personalized, actionable recommendations to improve MSME credit score
"""
from typing import List, Dict, Any

def get_loan_eligibility(score: int, sector: str, band: str) -> Dict[str, Any]:
    """AI-driven loan eligibility advisor based on score profile"""
    products = []
    
    if score >= 750:
        products = [
            {"type": "Business Term Loan", "amount": "₹50L – ₹2Cr", "rate": "10.5% – 13%", "tenure": "Up to 5 years", "eligible": True},
            {"type": "Working Capital OD", "amount": "Up to ₹1Cr", "rate": "12% – 14%", "tenure": "Annual renewal", "eligible": True},
            {"type": "Equipment Finance", "amount": "₹10L – ₹75L", "rate": "11%", "tenure": "3 years", "eligible": True},
            {"type": "GST Invoice Discounting", "amount": "80% of invoice", "rate": "14% – 16%", "tenure": "90 days", "eligible": True},
        ]
        tier = "PREMIUM"
        message = "Excellent credit profile. Eligible for premium NBFC and bank products."
    elif score >= 600:
        products = [
            {"type": "MSME Working Capital", "amount": "₹5L – ₹50L", "rate": "16% – 20%", "tenure": "Up to 3 years", "eligible": True},
            {"type": "GST Invoice Discounting", "amount": "70% of invoice", "rate": "18% – 22%", "tenure": "90 days", "eligible": True},
            {"type": "Business Term Loan", "amount": "₹10L – ₹50L", "rate": "18% – 24%", "tenure": "Up to 2 years", "eligible": True},
            {"type": "Equipment Finance", "amount": "₹5L – ₹25L", "rate": "20%", "tenure": "2 years", "eligible": False},
        ]
        tier = "STANDARD"
        message = "Good profile. Eligible for NBFC and FinTech lender products with moderate rates."
    else:
        products = [
            {"type": "Micro Business Loan", "amount": "₹1L – ₹10L", "rate": "24% – 30%", "tenure": "Up to 18 months", "eligible": True},
            {"type": "Supply Chain Finance", "amount": "₹2L – ₹15L", "rate": "26%", "tenure": "60 days", "eligible": True},
            {"type": "MSME Working Capital", "amount": "₹5L – ₹25L", "rate": "22% – 28%", "tenure": "1 year", "eligible": False},
        ]
        tier = "BASIC"
        message = "Work on improving compliance consistency to unlock better products."
    
    # Sector-specific adjustments
    sector_boost = {"IT & Software": "+0.5%", "Manufacturing": "Standard", "Retail": "-0.5%", "General Trade": "Standard"}
    
    return {
        "tier": tier,
        "message": message,
        "eligible_products": products,
        "sector_rate_modifier": sector_boost.get(sector, "Standard"),
        "ready_for_nbfc": score >= 600,
        "ready_for_bank": score >= 750,
    }


def get_improvement_recommendations(score: int, features: Dict) -> List[Dict[str, str]]:
    """Returns personalized, actionable steps to improve the credit score"""
    recommendations = []
    
    if score < 750:
        recommendations.append({
            "action": "File GST Returns on Time",
            "impact": "+30 to +50 pts",
            "timeline": "3 months",
            "priority": "critical",
            "detail": "Consistent GST filing is the single highest-weighted factor. File by the 20th of every month to maximize this score."
        })
    
    if score < 700:
        recommendations.append({
            "action": "Increase UPI Transaction Frequency",
            "impact": "+20 to +35 pts",
            "timeline": "2 months",
            "priority": "high",
            "detail": "Use UPI for all business receipts and payments. Higher velocity signals strong business operations to our AI engine."
        })
    
    if score < 650:
        recommendations.append({
            "action": "Diversify Customer Base",
            "impact": "+15 to +25 pts",
            "timeline": "6 months",
            "priority": "high",
            "detail": "Over-reliance on 1-2 customers is a major risk factor. Aim to ensure no single customer exceeds 30% of revenue."
        })
    
    recommendations.append({
        "action": "Generate E-Way Bills for All Interstate Trade",
        "impact": "+10 to +20 pts",
        "timeline": "1 month",
        "priority": "medium",
        "detail": "E-way bill consistency is a strong proxy for actual business activity. Ensure all goods movements are documented."
    })
    
    recommendations.append({
        "action": "Maintain Minimum Average Bank Balance",
        "impact": "+10 to +15 pts",
        "timeline": "3 months",
        "priority": "medium",
        "detail": "A stable average monthly balance demonstrates financial health. Target 2x your average monthly expense as a buffer."
    })
    
    if score < 600:
        recommendations.append({
            "action": "Resolve Any Pending GST Notices",
            "impact": "+25 to +40 pts",
            "timeline": "Immediate",
            "priority": "critical",
            "detail": "Outstanding GST notices or late filing penalties severely impact the score. Resolve these before applying for credit."
        })
    
    return recommendations[:5]  # Return top 5
