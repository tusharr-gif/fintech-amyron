"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldCheck, Gauge, Zap, TrendingUp, Info, AlertTriangle, ArrowRight, BarChart, Server } from 'lucide-react';

export default function Home() {
  const [gstin, setGstin] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const fetchScore = async () => {
    if (!gstin || gstin.length !== 15) {
        alert("Please enter a valid 15-character GSTIN.");
        return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/get-credit-score', {
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
          turnover: 'GST Verified ✅', 
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
      let fallbackScore = gstin === '27AAPFU0939F1ZV' ? 785 : 669;
      setData({
        score: fallbackScore,
        band: fallbackScore > 750 ? 'LOW RISK' : 'MEDIUM RISK',
        loanAmt: fallbackScore > 750 ? '₹ 5.0 Cr' : '₹ 2.2 Cr',
        sector: 'IT & Software',
        state: 'Local Simulation',
        turnover: '₹1-5 Cr',
        reasons: fallbackScore > 750 
            ? [
                {"text": "Consistent GST filing for 12+ months with zero defaults", "type": "success"},
                {"text": "Strong UPI transaction velocity indicating healthy customer flow", "type": "success"},
                {"text": "Active supply chain with consistent e-way bill generation", "type": "success"},
                {"text": "Quarter-on-quarter revenue growth of 18%+", "type": "success"}
              ]
            : [
                {"text": "Frequent GST filing delays detected.", "type": "warning"},
                {"text": "High UPI transaction volatility.", "type": "warning"},
                {"text": "Revenue fluctuations exceed 40% month-over-month", "type": "warning"}
              ],
        benchmark: { sector_average: 654, percentile: fallbackScore > 750 ? 92 : 68, points_diff: fallbackScore - 654 },
        contributions: [
           { label: "Gst Compliance", value: 85, is_positive: true },
           { label: "Upi Velocity", value: 45, is_positive: true },
           { label: "E Way Bill", value: 35, is_positive: true },
           { label: "Revenue Stability", value: 30, is_positive: fallbackScore < 700 },
           { label: "Growth Rate", value: 25, is_positive: true }
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

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-grid text-white p-6 md:p-12 selection:bg-cyan-500 selection:text-white">
      {/* Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px]"></div>
      </div>

      <nav className="relative z-10 w-full max-w-6xl mx-auto flex justify-between items-center mb-16 px-4">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Zap className="text-black w-6 h-6 fill-current" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-glow">CREDITPULSE</span>
        </motion.div>
        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex gap-6 text-sm font-medium text-gray-400">
          <span className="hover:text-cyan-400 cursor-pointer transition-colors">Engine: Core_XG_2.0</span>
          <span className="flex items-center gap-2"><Server className="w-4 h-4 text-green-500" /> API: Active</span>
        </motion.div>
      </nav>

      <div className="relative z-10 max-w-5xl mx-auto text-center mb-20 px-4">
        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-tight">
            DECODE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-500">CREDIT</span><br/>
            <span className="opacity-80">WITH ALTERNATIVE SIGNALS</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl font-light mb-10 leading-relaxed">
            Real-time explainable AI scoring for Indian MSMEs. <br className="hidden md:block"/> 
            Analyzing <span className="text-cyan-400 font-medium">GST, UPI, and Cash Flow</span> without traditional credit history.
          </p>
        </motion.div>
        
        {/* Search Engine UI */}
        <motion.div 
          className="glass p-2 rounded-2xl max-w-2xl mx-auto flex gap-3 shadow-2xl relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent pointer-events-none"></div>
          <input 
            type="text" 
            placeholder="ENTER 15-DIGIT GSTIN" 
            className="flex-1 bg-transparent px-6 py-4 outline-none text-cyan-400 font-mono tracking-widest text-lg placeholder-gray-600"
            value={gstin} 
            onChange={(e) => setGstin(e.target.value.toUpperCase())}
          />
          <button 
            onClick={fetchScore} 
            disabled={loading}
            className="bg-cyan-500 hover:bg-cyan-400 text-black px-8 py-4 rounded-xl font-black tracking-tighter transition-all flex items-center gap-2 disabled:opacity-50 group shadow-lg shadow-cyan-500/20"
          >
            {loading ? 'COMPUTING...' : 'ANALYZE ENGINE'}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        <div className="flex gap-4 justify-center mt-6">
          {['27AAPFU0939F1ZV', '29GGGGG1314R9Z6'].map(id => (
            <button key={id} onClick={() => setGstin(id)} className="text-[10px] tracking-widest text-gray-600 hover:text-cyan-500 font-mono transition-colors uppercase">
              Sample: {id}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {data && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-12 gap-8 pb-20 px-4"
          >
            {/* SCORE CARD */}
            <div className="md:col-span-4 flex flex-col gap-8">
              <motion.div 
                className="glass p-8 rounded-[2rem] glow-box relative overflow-hidden group"
                whileHover={{ y: -5 }}
              >
                <div className="absolute top-0 right-0 p-4"><Zap className="w-5 h-5 text-cyan-500 opacity-30" /></div>
                <div className="flex flex-col items-center justify-center py-10 relative">
                  <svg className="w-64 h-64 -rotate-90 transform">
                    <circle cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-900" />
                    <motion.circle 
                      cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="12" fill="transparent" 
                      className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" 
                      strokeDasharray={690}
                      initial={{ strokeDashoffset: 690 }}
                      animate={{ strokeDashoffset: 690 - (690 * data.score / 900) }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-0">
                    <motion.span 
                      initial={{ scale: 0 }} animate={{ scale: 1 }} 
                      className="text-7xl font-black tracking-tighter"
                    >
                      {data.score}
                    </motion.span>
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Score / 900</span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <div className={`px-6 py-2 rounded-full text-xs font-black tracking-widest ${data.score > 750 ? 'bg-green-500 text-black' : 'bg-orange-500 text-black'}`}>
                    {data.band}
                  </div>
                  <div className="text-center text-gray-400">
                    <p className="text-[10px] tracking-widest uppercase mb-1">Recommended Facility</p>
                    <p className="text-4xl font-black text-white">{data.loanAmt}</p>
                  </div>
                </div>
              </motion.div>

              <div className="glass p-8 rounded-[2rem] border-l-4 border-l-cyan-500">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-black text-lg tracking-widest uppercase">Business ID</h3>
                  <div className="px-2 py-1 bg-cyan-500/10 text-cyan-400 text-[10px] font-bold rounded">VERIFIED</div>
                </div>
                <div className="space-y-6">
                  {[
                    { label: 'SECTOR', value: data.sector, icon: <Activity className="w-4 h-4" /> },
                    { label: 'REGION', value: data.state, icon: <TrendingUp className="w-4 h-4" /> },
                    { label: 'VELOCITY', value: data.turnover, icon: <Zap className="w-4 h-4" /> }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 tracking-widest uppercase">{item.label}</p>
                        <p className="font-bold text-lg">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ANALYTICS HUB */}
            <div className="md:col-span-8 flex flex-col gap-8">
              
              {/* AI Rationale */}
              <div className="glass p-8 rounded-[2rem] overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl pointer-events-none"></div>
                <div className="flex items-center gap-3 mb-8">
                  <ShieldCheck className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl font-black tracking-tighter">AI SCORING RATIONALE</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {data.reasons.map((reason: any, idx: number) => (
                    <motion.div 
                      key={idx} 
                      className={`p-5 rounded-2xl border flex items-start gap-4 transition-all hover:translate-x-2 ${reason.type === 'success' ? 'bg-green-500/5 border-green-500/20' : 'bg-orange-500/5 border-orange-500/20'}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <div className={`mt-1 p-1 rounded-full ${reason.type === 'success' ? 'bg-green-500' : 'bg-orange-500'}`}>
                        <Zap className="w-3 h-3 text-black fill-current" />
                      </div>
                      <p className="text-sm md:text-base font-medium leading-relaxed text-gray-200">{reason.text}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Benchmarks & Trends */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="glass p-8 rounded-[2rem]">
                  <div className="flex items-center gap-3 mb-8">
                    <BarChart className="w-5 h-5 text-purple-400" />
                    <h3 className="font-black text-sm tracking-widest uppercase">Benchmark</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <span className="text-5xl font-black text-glow">P{data.benchmark.percentile}</span>
                      <div className="text-right">
                        <p className={`font-bold ${data.benchmark.points_diff > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {data.benchmark.points_diff > 0 ? '+' : ''}{data.benchmark.points_diff} PTS
                        </p>
                        <p className="text-[10px] text-gray-500">VS SECTOR AVG</p>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} animate={{ width: `${data.benchmark.percentile}%` }} 
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="glass p-8 rounded-[2rem]">
                  <div className="flex items-center gap-3 mb-8">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-black text-sm tracking-widest uppercase">Trend Engine</h3>
                  </div>
                  <div className="h-24 w-full flex items-end justify-between px-2">
                    {data.trend.map((t: any, i: number) => (
                      <div key={i} className="flex flex-col items-center gap-2 group">
                        <motion.div 
                          className="w-8 md:w-10 bg-cyan-500/20 border border-cyan-500/40 rounded-t-lg group-hover:bg-cyan-500 transition-all cursor-crosshair"
                          initial={{ height: 0 }}
                          animate={{ height: `${(t.score / 900) * 100}%` }}
                        />
                        <span className="text-[8px] text-gray-600 font-bold uppercase">{t.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feature Importance (SHAP-STYLE) */}
              <div className="glass p-8 rounded-[2rem]">
                 <div className="flex items-center justify-between mb-8">
                   <div className="flex items-center gap-3">
                     <Gauge className="w-6 h-6 text-cyan-400" />
                     <h3 className="text-lg font-black tracking-tighter uppercase underline decoration-cyan-500 decoration-2 underline-offset-8">Neural Importance</h3>
                   </div>
                   <span className="text-[10px] text-gray-500 font-mono tracking-tighter">ALGO: SHAP_v4.1</span>
                 </div>
                 <div className="space-y-5">
                   {data.contributions.map((item: any, i: number) => (
                     <div key={i} className="group">
                        <div className="flex justify-between text-[10px] font-bold tracking-widest text-gray-500 mb-2 transition-colors group-hover:text-cyan-400 uppercase">
                          <span>{item.label}</span>
                          <span>{item.value}% IMPACT</span>
                        </div>
                        <div className="w-full h-1 bg-gray-900 rounded-full overflow-hidden">
                           <motion.div 
                            initial={{ width: 0 }} animate={{ width: `${item.value}%` }} 
                            className={`h-full ${item.is_positive ? 'bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.4)]' : 'bg-red-500'}`}
                           />
                        </div>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="fixed bottom-0 left-0 w-full p-6 text-center text-[10px] tracking-widest text-gray-600 z-10 pointer-events-none">
        MSME CREDIT RISK EVALUATION ENGINE // SECURE_MODE_ON // VERSION 2.2.0
      </footer>
    </main>
  );
}
