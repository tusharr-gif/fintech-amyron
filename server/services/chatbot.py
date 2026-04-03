"""
CreditPulse Conversational AI Chatbot Engine
Explains credit scores to MSMEs and guides them on improvement steps
"""
from typing import Dict, List

# Knowledge base for chatbot responses
SCORE_EXPLANATIONS = {
    "high": """Your CreditPulse score of {score} places you in the **LOW RISK** band — excellent work! 
This means you have a consistent GST filing history, healthy UPI cash flow, and low customer concentration risk. 
Lenders will view your business favorably. You can apply for loan amounts up to {loan}.""",
    
    "medium": """Your CreditPulse score of {score} is in the **MEDIUM RISK** band. 
You have a decent financial foundation, but there are some areas to strengthen — particularly your 
GST consistency and cash flow predictability. You currently qualify for working capital loans up to {loan}. 
Focus on the improvement plan to move to the next tier within 3-6 months.""",
    
    "low": """Your CreditPulse score of {score} places you in the **HIGH RISK** band. 
Don't worry — this is a starting point, not a final judgment. The CreditPulse system has identified 
specific, actionable steps that can improve your score significantly within 3-6 months. 
The most critical action is to file all pending GST returns and maintain consistent UPI activity."""
}

CHAT_RESPONSES = {
    "what is my score": "Your current CreditPulse score is **{score}** out of 900. This score is calculated in real-time using your GST filing history, UPI transaction velocity, cash flow patterns, and e-way bill activity.",
    "how is score calculated": "Your score is computed using a Gradient Boosting AI model trained on 5,000+ MSME financial profiles. The key factors are: (1) GST filing regularity, (2) UPI transaction velocity and growth, (3) Cash flow volatility, (4) Customer concentration risk, and (5) E-way bill activity consistency.",
    "how to improve score": "The fastest way to improve your score is to: 1) File GST returns on time every month, 2) Use UPI for all business transactions, 3) Diversify your customer base, 4) Generate e-way bills for all shipments. Your personalized improvement plan is shown in the 'Improvement Plan' tab.",
    "what loan can i get": "Based on your score of **{score}** and risk band **{band}**, you are eligible for loan products up to **{loan}**. The Loan Advisor section shows you specific products from NBFCs and FinTech lenders.",
    "what is gstin": "GSTIN stands for Goods and Services Tax Identification Number. It's a 15-digit unique identifier assigned to every GST-registered business in India. Your GST filing history from GSTIN is one of the strongest signals in your credit score.",
    "what is upi velocity": "UPI Velocity measures how frequently and consistently your business receives and sends payments via UPI. High UPI activity signals a healthy, liquid business. We analyze the growth trend, seasonality, and consistency of your UPI cash flows.",
    "is this safe": "Yes, absolutely. CreditPulse is designed for financial inclusion and is regulator-friendly. We do not store your GSTIN or financial data beyond the active session. All scoring is based on publicly available GST data patterns and simulated UPI signals for this MVP.",
    "when does score update": "In the production version, your score updates in real-time as new financial data arrives (GST filings, UPI transactions). For this MVP, the score is computed fresh each time you enter your GSTIN.",
    "default": "I can help you understand your credit score, loan eligibility, improvement steps, and how the scoring works. Try asking: 'How is my score calculated?' or 'What loan can I get?' or 'How to improve my score?'"
}

def get_chatbot_response(message: str, context: Dict) -> Dict:
    """Process user message and return contextual AI response"""
    message_lower = message.lower().strip()
    score = context.get("score", 0)
    band = context.get("band", "N/A")
    loan = context.get("loan", "N/A")
    
    # Match intent
    response_text = None
    
    for key, response in CHAT_RESPONSES.items():
        if key == "default":
            continue
        if any(word in message_lower for word in key.split()):
            response_text = response.format(score=score, band=band, loan=loan)
            break
    
    if response_text is None:
        # Check score-based contextual response
        if "explain" in message_lower or "score" in message_lower:
            if score >= 750:
                response_text = SCORE_EXPLANATIONS["high"].format(score=score, loan=loan)
            elif score >= 600:
                response_text = SCORE_EXPLANATIONS["medium"].format(score=score, loan=loan)
            else:
                response_text = SCORE_EXPLANATIONS["low"].format(score=score, loan=loan)
        else:
            response_text = CHAT_RESPONSES["default"]
    
    # Generate follow-up suggestions
    suggestions = [
        "How is my score calculated?",
        "What loan can I get?",
        "How to improve my score?",
        "Is this safe?",
        "What is UPI velocity?"
    ]
    
    return {
        "response": response_text,
        "suggestions": suggestions[:3],
        "confidence": 0.94,
        "powered_by": "CreditPulse NLP Engine v2.0"
    }
