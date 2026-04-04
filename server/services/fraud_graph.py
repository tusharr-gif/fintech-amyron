import networkx as nx
import random
from typing import List, Dict, Any, Tuple

class FraudGraphEngine:
    def __init__(self):
        self.G = nx.DiGraph()
        self._seed_mock_data()

    def _seed_mock_data(self):
        # ── ENTITIES (NODES) ──
        # Let's seed some legitimate entities and some 'fraud rings'
        entities = [
            "27AAPFU0939F1ZV", "27AABCV1234A1Z1", "27XYZ1234567890", 
            "29BBBB1234A1Z", "33CCCC1234A1Z", "19DDDD1234A1Z"
        ]
        
        # Regular flow
        for i in range(len(entities)-1):
            self.G.add_edge(entities[i], entities[i+1], weight=random.randint(1000, 50000), tx_count=random.randint(1, 10))

        # ── FRAUD RING 1 (Closed Loop) ──
        # A -> B -> C -> A
        ring1 = ["RING_A1", "RING_B1", "RING_C1"]
        self.G.add_edge("RING_A1", "RING_B1", weight=250000, tx_count=45, type='high_velocity')
        self.G.add_edge("RING_B1", "RING_C1", weight=245000, tx_count=42, type='high_velocity')
        self.G.add_edge("RING_C1", "RING_A1", weight=248000, tx_count=44, type='high_velocity')
        
        # Link a real MSME to the ring (Suspicion)
        self.G.add_edge("27AAPFU0939F1ZV", "RING_A1", weight=50000, tx_count=12, type='standard')

    def analyze_entity(self, gstin: str) -> Dict[str, Any]:
        if not self.G.has_node(gstin):
            return {"risk_score": 0.05, "cycles": [], "flag": "CLEAR"}

        # 1. ── CYCLE DETECTION (Circular Trading) ──
        # Use Simple Cycles (limited search depth for performance)
        cycles = list(nx.simple_cycles(self.G))
        relevant_cycles = [c for c in cycles if gstin in c]
        
        # 2. ── STRONGLY CONNECTED COMPONENTS ──
        sccs = list(nx.strongly_connected_components(self.G))
        in_scc = [s for s in sccs if gstin in s and len(s) > 1]

        # 3. ── RISK SCORING ──
        # Baseline = local hubs / centrality
        centrality = nx.pagerank(self.G).get(gstin, 0)
        
        cycle_count = len(relevant_cycles)
        scc_size = len(in_scc[0]) if in_scc else 0
        
        # Fraud risk = weighted combination of loops and SCC involvement
        risk_score = min(1.0, (cycle_count * 0.4) + (scc_size * 0.1) + (centrality * 10))
        
        return {
            "fraud_risk_score": round(risk_score, 4),
            "cycle_count": cycle_count,
            "in_fraud_ring": scc_size > 2,
            "centrality": round(centrality, 4),
            "cycles": relevant_cycles,
            "flag": "ALERT" if risk_score > 0.5 else "CLEAR",
            "explanation": f"Entity is involved in {cycle_count} circular trading loops. SCC size of {scc_size} indicates complex cluster membership."
        }

    def get_graph_visualization(self, gstin: str) -> Dict[str, Any]:
        # Return a sub-graph around the entity for visualization
        # Ego-graph (radius=2)
        if not self.G.has_node(gstin):
            # Fallback to a tiny mock graph if node not found
            return {"nodes": [{"id": gstin}], "links": []}

        sub_g = nx.ego_graph(self.G, gstin, radius=2)
        
        nodes = []
        for n in sub_g.nodes():
            nodes.append({
                "id": n, 
                "label": n[:6] if len(n) > 10 else n,
                "val": 10 if n == gstin else 5,
                "color": "#ff4444" if self.analyze_entity(n)['flag'] == 'ALERT' else "#22d3ee"
            })
            
        links = []
        for u, v, d in sub_g.edges(data=True):
            links.append({
                "source": u,
                "target": v,
                "value": d.get('weight', 1) / 10000,
                "type": d.get('type', 'standard')
            })
            
        return {"nodes": nodes, "links": links}

fraud_engine = FraudGraphEngine()
