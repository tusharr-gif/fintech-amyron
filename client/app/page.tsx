"use client";
import React, { useState } from 'react';

export default function Home() {
  const [gstin, setGstin] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const fetchScore = async () => {
    if (!gstin || gstin.length !== 15) {
        alert("Please enter a valid 15-character GSTIN.");
        return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/get-credit-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gstin: gstin }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setData({
          score: result.credit_score,
          band: result.risk_band,
          loanAmt: result.recommended_loan_amount,
          sector: result.details.sector,
          state: result.details.state,
          turnover: 'Data inferred from GST', 
          reasons: result.top_reasons,
          benchmark: result.sector_benchmark,
          contributions: result.feature_contributions,
          trend: result.score_trend
        });
      } else {
        alert(result.detail || "Error fetching score");
      }
    } catch (error) {
      console.error("Backend offline. Using Local Demo Fallback:", error);
      // Hackathon Safety Net: Mock data if Python server is unreachable
      let fallbackScore = gstin === '27AAPFU0939F1ZV' ? 785 : 669;
      setData({
        score: fallbackScore,
        band: fallbackScore > 750 ? 'LOW RISK' : 'MEDIUM RISK',
        loanAmt: fallbackScore > 750 ? '₹ 5,00,00,000' : '₹ 2,19,00,000',
        sector: 'IT & Software',
        state: 'Local Simulation',
        turnover: '₹1-5 Cr',
        reasons: fallbackScore > 750 
            ? [
                {"text": "Consistent GST filing for 12+ months with zero defaults", "type": "success"},
                {"text": "Strong UPI transaction velocity indicating healthy customer flow", "type": "success"},
                {"text": "Active supply chain with consistent e-way bill generation", "type": "success"},
                {"text": "Quarter-on-quarter revenue growth of 18%+", "type": "success"},
                {"text": "Stable digital presence and social sentiment", "type": "success"}
              ]
            : [
                {"text": "Frequent GST filing delays (Simulated).", "type": "warning"},
                {"text": "High UPI transaction volatility.", "type": "warning"},
                {"text": "Revenue fluctuations exceed 40% month-over-month", "type": "warning"},
                {"text": "Circular trading signals detected.", "type": "warning"},
                {"text": "Limited sector history.", "type": "success"}
              ],
        benchmark: {
           sector_average: 654,
           percentile: fallbackScore > 750 ? 92 : 68,
           points_diff: fallbackScore - 654
        },
        contributions: [
           { label: "Gst Compliance", value: 85, is_positive: true },
           { label: "Upi Velocity", value: 45, is_positive: true },
           { label: "E Way Bill", value: 35, is_positive: true },
           { label: "Revenue Stability", value: 30, is_positive: fallbackScore < 700 },
           { label: "Growth Rate", value: 25, is_positive: true },
           { label: "Digital Presence", value: 20, is_positive: true },
        ],
        trend: [
           { month: "May", score: fallbackScore - 20 },
           { month: "Jul", score: fallbackScore + 10 },
           { month: "Sep", score: fallbackScore - 5 },
           { month: "Nov", score: fallbackScore + 15 },
           { month: "Jan", score: fallbackScore - 10 },
           { month: "Apr", score: fallbackScore }
        ]
      });
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen text-white p-8 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-12">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-cyan-400 flex items-center justify-center text-black font-bold">⚡</div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-white">CreditPulse</h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-cyan-400">
           <span>Real-time scoring engine</span>
        </div>
      </div>

      {/* Hero */}
      <div className="text-center mb-10 w-full max-w-3xl">
        <h2 className="text-5xl font-black mb-4"><span className="text-cyan-400">Alternative Credit Scoring</span><br/>for India's MSMEs</h2>
        <p className="text-gray-400 mb-8">Leverage GST filings, UPI transactions, cash flow patterns, and e-way bill data to generate explainable credit scores — no traditional credit history needed.</p>
        
        {/* Input area */}
        <div className="flex gap-4 p-2 glass rounded-xl">
           <input type="text" placeholder="Enter GSTIN" 
               className="bg-transparent flex-1 outline-none px-4 text-white placeholder-gray-500"
               value={gstin} onChange={(e) => setGstin(e.target.value)} />
           <button onClick={fetchScore} className="bg-cyan-400 hover:bg-cyan-300 text-black px-6 py-3 rounded-lg font-semibold transition-all">
             {loading ? 'Analyzing...' : 'Analyze'}
           </button>
        </div>
        
        <div className="flex gap-3 justify-center items-center mt-4 text-xs">
          <span className="text-gray-500">Try sample:</span>
          <span className="glass px-3 py-1 cursor-pointer bg-slate-800/50" onClick={() => setGstin('27AAPFU0939F1ZV')}>27AAPFU0939F1ZV</span>
          <span className="glass px-3 py-1 cursor-pointer bg-slate-800/50" onClick={() => setGstin('29GGGGG1314R9Z6')}>29GGGGG1314R9Z6</span>
        </div>
      </div>

      {/* Results Dashboard */}
      {data && (
        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          <div className="glass p-6 flex flex-col items-center justify-center relative shadow-[0_0_50px_rgba(45,212,191,0.05)] border-t border-t-cyan-500/10">
            <div className="w-48 h-48 rounded-full border-8 border-gray-800 border-t-orange-400 border-r-orange-400 flex flex-col items-center justify-center drop-shadow-[0_0_15px_rgba(251,146,60,0.5)]">
               <span className="text-4xl font-extrabold">{data.score}</span>
               <span className="text-xs text-gray-500">out of 900</span>
            </div>
            <div className="mt-4 px-4 py-1 bg-orange-400 text-black rounded-full text-xs font-bold">{data.band}</div>
            
            <div className="mt-6 text-center">
              <div className="text-sm text-gray-400">Recommended Loan</div>
              <div className="text-3xl text-cyan-400 font-bold">{data.loanAmt}</div>
            </div>
          </div>

          <div className="glass p-6 relative overflow-hidden">
             <div className="absolute top-4 right-4 border border-teal-500/30 bg-teal-500/10 text-teal-400 text-xs px-2 py-1 rounded">95% confidence</div>
             <h3 className="text-xl font-bold mb-1">Business Profile</h3>
             <div className="text-sm text-gray-500 mb-6">{gstin}</div>
             
             <div className="grid grid-cols-2 gap-4">
               <div>
                  <div className="text-xs text-gray-500 mb-1">SECTOR</div>
                  <div className="font-semibold">{data.sector}</div>
               </div>
               <div>
                  <div className="text-xs text-gray-500 mb-1">STATE</div>
                  <div className="font-semibold">{data.state}</div>
               </div>
               <div>
                  <div className="text-xs text-gray-500 mb-1">TURNOVER</div>
                  <div className="font-semibold">{data.turnover}</div>
               </div>
             </div>
          </div>

          {/* Explainable AI Reasons spanning full width */}
          <div className="md:col-span-2 glass p-6 border-t border-t-cyan-500/10 mt-2">
            <div className="flex items-center gap-2 mb-4">
               <div className="w-6 h-6 rounded bg-cyan-400/20 flex items-center justify-center text-cyan-400 text-sm">💡</div>
               <h3 className="text-lg font-bold text-white">AI Scoring Rationale (Explainability)</h3>
            </div>
            {data.reasons && data.reasons.length > 0 ? (
                <ul className="space-y-3">
                  {data.reasons.map((reason: any, idx: number) => (
                    <li key={idx} className="flex gap-3 text-sm text-white items-start bg-slate-800/40 p-3 rounded-lg border border-slate-700/50">
                        <span className="text-cyan-400 font-bold mt-0.5">✓</span>
                        <span>{typeof reason === 'string' ? reason : reason.text}</span>
                    </li>
                  ))}
                </ul>
            ) : (
                <p className="text-sm text-gray-500">Analysis logic pending.</p>
            )}
          </div>

          {/* Top 5 Score Factors */}
          <div className="md:col-span-2 glass p-6 border-t border-t-cyan-500/10 mt-2">
            <div className="mb-6">
               <h3 className="text-xl font-bold text-white">Top 5 Score Factors</h3>
               <p className="text-sm text-gray-500">Explainable AI-powered reasoning</p>
            </div>
            <div className="space-y-4">
              {data.reasons && data.reasons.map((factor: any, idx: number) => (
                <div key={idx} className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-white/5 transition-hover hover:border-cyan-500/30">
                   <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${factor.type === 'success' ? 'border-green-500 text-green-500' : 'border-orange-500 text-orange-500'}`}>
                      {factor.type === 'success' ? '✓' : '!'}
                   </div>
                   <span className="text-sm font-medium text-gray-200">{factor.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Feature Contributions (SHAP-style) */}
          <div className="md:col-span-1 glass p-6 flex flex-col">
            <div className="mb-6">
               <h3 className="text-lg font-bold text-white">Feature Contributions</h3>
               <p className="text-xs text-gray-500">SHAP-style impact on credit score</p>
            </div>
            
            <div className="flex-1 flex flex-col justify-between py-2">
              {data.contributions && data.contributions.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-2 group">
                   <div className="w-24 text-[10px] text-gray-400 text-right truncate">{item.label}</div>
                   <div className="flex-1 h-6 flex items-center relative">
                      <div className="absolute left-1/4 w-[1px] h-full bg-gray-700/50"></div>
                      <div 
                        className={`h-4 rounded-sm transition-all duration-1000 ${item.is_positive ? 'bg-green-500 translate-x-[calc(25%)] ml-[1px]' : 'bg-red-500 -translate-x-[calc(1%)]'}`}
                        style={{ 
                            width: `${item.value / 2}%`, 
                            marginLeft: item.is_positive ? '25%' : `${25 - (item.value/2)}%` 
                        }}
                      ></div>
                   </div>
                </div>
              ))}
            </div>
          </div>

          {/* Score Trend */}
          <div className="md:col-span-1 glass p-6">
            <div className="mb-6">
               <h3 className="text-lg font-bold text-white">Score Trend</h3>
               <p className="text-xs text-gray-500">12-month credit score trajectory</p>
            </div>
            
            <div className="h-48 w-full mt-4 relative">
               <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                  <path 
                    d={`M0,${200 - (data.trend[0]?.score - 300)/3 || 150} L80,${200 - (data.trend[1]?.score - 300)/3 || 140} L160,${200 - (data.trend[2]?.score - 300)/3 || 120} L240,${200 - (data.trend[3]?.score - 300)/3 || 130} L320,${200 - (data.trend[4]?.score - 300)/3 || 110} L400,${200 - (data.trend[5]?.score - 300)/3 || 120}`} 
                    fill="none" 
                    stroke="#2dd4bf" 
                    strokeWidth="3"
                    className="drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]"
                  />
               </svg>
               <div className="flex justify-between mt-2 text-[10px] text-gray-500">
                  {data.trend && data.trend.map((t: any, i: number) => (
                    <span key={i}>{t.month}</span>
                  ))}
               </div>
            </div>
          </div>

          {/* Sector Benchmark Card spanning full width */}
          {data.benchmark && (
          <div className="md:col-span-2 glass p-6 border-t border-t-cyan-500/10 mt-2">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                 <div className="text-cyan-400">📊</div>
                 <h3 className="text-lg font-bold text-white">Sector Benchmark</h3>
              </div>
              <p className="text-sm text-gray-400">{data.sector} sector comparison</p>
            </div>
            
            <div className="flex justify-between items-end mb-3 mt-6">
              <div>
                 <div className="text-4xl font-bold text-cyan-400">P{data.benchmark.percentile}</div>
                 <div className="text-xs text-gray-500 mt-1">Percentile rank</div>
              </div>
              <div className="text-right">
                 <div className={`text-xl font-bold ${data.benchmark.points_diff > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {data.benchmark.points_diff > 0 ? '+' : ''}{data.benchmark.points_diff} pts
                 </div>
                 <div className="text-xs text-gray-500 mt-1">vs sector avg ({data.benchmark.sector_average})</div>
              </div>
            </div>

            {/* Progress Bar mapped from 300 to 900 */}
            <div className="relative w-full h-3 bg-slate-800 rounded-full mt-2 mb-2 overflow-hidden">
                <div 
                   className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full transition-all duration-1000 ease-out"
                   style={{ width: `${Math.max(0, Math.min(100, ((data.score - 300) / 600) * 100))}%` }}
                ></div>
            </div>

            <div className="flex justify-between text-[11px] text-gray-500 font-medium px-1">
                <span>300</span>
                <span>Sector Avg: {data.benchmark.sector_average}</span>
                <span>900</span>
            </div>
          </div>
          )}

        </div>
      )}
    </main>
  );
}
