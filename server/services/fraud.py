import networkx as nx
import random

class FraudDetectionEngine:
    def __init__(self):
        # Create a mock directed graph representing MSME B2B transactions
        self.transaction_graph = nx.DiGraph()
        self._seed_mock_network()

    def _seed_mock_network(self):
        """Seed a mock network of 50 core companies with edges defining transactions"""
        companies = [f"COMP_{i:03d}" for i in range(50)]
        self.transaction_graph.add_nodes_from(companies)
        
        # Add random normal transactions
        for _ in range(150):
            u = random.choice(companies)
            v = random.choice(companies)
            if u != v:
                self.transaction_graph.add_edge(u, v, weight=random.uniform(10, 100))

        # Purposefully inject a circular trading ring for fraud testing
        ring_nodes = ["COMP_001", "COMP_015", "COMP_034", "COMP_042", "COMP_001"]
        for i in range(len(ring_nodes) - 1):
            self.transaction_graph.add_edge(ring_nodes[i], ring_nodes[i+1], weight=500, label="High-Risk Link")
            
    def analyze_gstin_vulnerability(self, virtual_gstin: str) -> dict:
        """Runs graph algorithms to detect circular trading patterns"""
        # Map our virtual GSTIN to a random node for demo purposes
        node = random.choice(list(self.transaction_graph.nodes()))
        
        try:
            # Check for simple cycles involving this node
            cycles = list(nx.simple_cycles(self.transaction_graph))
            involved_cycles = [c for c in cycles if node in c]
            
            is_circular = len(involved_cycles) > 0
            
            # Calculate Graph Centrality (High centrality + cyclic = highly suspicious)
            eigen_centrality = nx.eigenvector_centrality(self.transaction_graph, max_iter=1000)
            node_centrality = eigen_centrality.get(node, 0.0)
            
            return {
                "analyzed_node": node,
                "is_circular_trading_detected": is_circular,
                "cycles_involved": len(involved_cycles),
                "network_centrality": round(node_centrality, 4),
                "fraud_probability": 0.85 if is_circular else random.uniform(0.01, 0.15)
            }
        except nx.NetworkXError:
            return {"fraud_probability": 0.05, "is_circular_trading_detected": False}

# Singleton instance
fraud_engine = FraudDetectionEngine()

if __name__ == "__main__":
    print(fraud_engine.analyze_gstin_vulnerability("MOCK_GSTIN"))
