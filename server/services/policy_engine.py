from datetime import datetime
from typing import Dict, Any, List

class PolicyEngine:
    def __init__(self):
        # ── CONFIGURATION (In Prod, from DB or Config Store) ──
        self.active_policies = [
            {
                "id": "POLICY_GST_AMNESTY_2024",
                "name": "MSME GST Amnesty (Apr-Jun 24)",
                "description": "Late GST filings within this window are not penalized during MSME Credit Scoring.",
                "valid_from": "2024-04-01",
                "valid_till": "2024-06-30",
                "rule_overrides": {
                    "gstin_delay_penalty": 0.0,
                    "compliance_weight_modifier": 0.5,
                    "reason_text": "Late filing waived (Amnesty Scheme 2024 Active)"
                }
            },
            {
                "id": "POLICY_SECTOR_PRIORITY_AGRI",
                "name": "Agri-Tech Lending Priority",
                "description": "Boosting scores for agriculture-related sectors to improve outreach.",
                "valid_from": "2024-01-01",
                "valid_till": "2025-12-31",
                "target_sectors": ["Agriculture", "Agri-Processing"],
                "rule_overrides": {
                    "sector_risk_modifier": 1.25,
                    "reason_text": "Agri-Tech Sector Boost Active"
                }
            }
        ]

    def get_overrides(self, entity_data: Dict[str, Any]) -> Tuple[Dict[str, Any], List[str]]:
        """Calculate score/feature overrides based on active government policies."""
        now = datetime.now().strftime("%Y-%m-%d")
        applied_overrides = {}
        active_labels = []
        
        sector = entity_data.get("sector", "General")
        
        for policy in self.active_policies:
            # Date Check
            if policy["valid_from"] <= now <= policy["valid_till"]:
                
                # Check for Sector constraints
                if "target_sectors" in policy:
                    if sector not in policy["target_sectors"]:
                        continue # Policy not for this sector
                
                # Merge overrides
                for k, v in policy["rule_overrides"].items():
                    applied_overrides[k] = v
                
                active_labels.append(policy["name"])
        
        return applied_overrides, active_labels

policy_engine = PolicyEngine()
