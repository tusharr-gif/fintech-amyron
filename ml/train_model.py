import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
import pickle
import os

print("🚀 Starting CreditPulse ML Orchestrator...")
print("[1/3] Generating diverse Indian MSME synthetic financial dataset...")

# Generate synthetic data for 5000 MSMEs
np.random.seed(42)
n_samples = 5000

data = {
    'gstin_regularity_score': np.random.uniform(0.4, 1.0, n_samples),
    'upi_velocity_inflow': np.random.normal(500000, 150000, n_samples),
    'upi_velocity_outflow': np.random.normal(400000, 100000, n_samples),
    'customer_concentration': np.random.uniform(0.1, 0.9, n_samples),
    'circular_trading_flag': np.random.choice([0, 1], p=[0.95, 0.05], size=n_samples),
    'cash_flow_volatility': np.random.uniform(0.05, 0.5, n_samples),
    'sector_risk_modifier': np.random.uniform(0.8, 1.2, n_samples)
}

df = pd.DataFrame(data)

# Formulate complex non-linear target mapping for the model to learn
# Target: Credit Score Bin (0: High Risk, 1: Medium Risk, 2: Low Risk)
def assign_risk(row):
    score = (row['gstin_regularity_score'] * 30 + 
             (row['upi_velocity_inflow'] / 100000) * 5 - 
             row['customer_concentration'] * 15 - 
             row['cash_flow_volatility'] * 20 -
             row['circular_trading_flag'] * 50) * row['sector_risk_modifier']
    
    if score > 45: return 2
    elif score > 20: return 1
    else: return 0

df['risk_category'] = df.apply(assign_risk, axis=1)

print("[2/3] Training Gradient Boosting Credit Scoring Model (XGBoost logic)...")
X = df.drop('risk_category', axis=1)
y = df['risk_category']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, max_depth=4, random_state=42)
model.fit(X_train, y_train)

accuracy = model.score(X_test, y_test)
print(f"✅ Model trained successfully. Validation Accuracy: {accuracy*100:.2f}%")

print("[3/3] Exporting model binaries to disk...")
os.makedirs('artifacts', exist_ok=True)
with open('artifacts/credit_model.pkl', 'wb') as f:
    pickle.dump(model, f)

print("🎉 ML Pipeline Complete. Model artifacts are ready for FastAPI consumption!")
