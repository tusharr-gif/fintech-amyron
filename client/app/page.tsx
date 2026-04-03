"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, ShieldCheck, Gauge, Zap, TrendingUp, ArrowRight,
  BarChart, Server, MessageCircle, Send, X, AlertTriangle,
  CheckCircle, Target, Users, Clock, Star, ChevronRight,
  RefreshCw, Lock, Globe, CreditCard, Lightbulb, Volume2, VolumeX, Mic
} from 'lucide-react';

const API = 'http://127.0.0.1:8000';

// ─────────────────────────────────────────────
// TAB DEFINITIONS
// ─────────────────────────────────────────────
const TABS = [
  { key: 'score', label: 'Score Report', icon: Gauge },
  { key: 'revenue', label: 'Revenue Intel', icon: Activity },
  { key: 'advisor', label: 'Loan Advisor', icon: CreditCard },
  { key: 'improve', label: 'Improve Score', icon: TrendingUp },
  { key: 'benchmark', label: 'Sector Bench', icon: BarChart },
  { key: 'fraud', label: 'Risk Signals', icon: ShieldCheck },
];

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────

function ScoreGauge({ score }: { score: number }) {
  const pct = (score - 300) / 600;
  const R1 = 100, R2 = 82, R3 = 64;
  const CIRC = (r: number) => 2 * Math.PI * r;
  const OFFSET = (r: number, p: number) => CIRC(r) - CIRC(r) * p;
  const color = score >= 750 ? '#22d3ee' : score >= 600 ? '#f59e0b' : '#ef4444';
  const colorMid = score >= 750 ? '#818cf8' : score >= 600 ? '#f97316' : '#f43f5e';
  const glowColor = score >= 750 ? 'rgba(34,211,238,0.5)' : score >= 600 ? 'rgba(245,158,11,0.5)' : 'rgba(239,68,68,0.5)';
  const label = score >= 750 ? 'EXCELLENT' : score >= 600 ? 'MODERATE' : 'NEEDS WORK';

  return (
    <div className="flex flex-col items-center relative">
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full" style={{ boxShadow: `0 0 60px ${glowColor}`, borderRadius: '50%', width: '224px', height: '224px', margin: 'auto' }} />
      <div className="relative w-56 h-56">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 224 224">
          <defs>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colorMid} />
              <stop offset="100%" stopColor={color} />
            </linearGradient>
            <linearGradient id="ring2Grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={colorMid} stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="ring3Grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colorMid} stopOpacity="0.15" />
              <stop offset="100%" stopColor={color} stopOpacity="0.4" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {/* Track rings */}
          <circle cx="112" cy="112" r={R1} stroke="#111827" strokeWidth="14" fill="none" />
          <circle cx="112" cy="112" r={R2} stroke="#0f172a" strokeWidth="8" fill="none" />
          <circle cx="112" cy="112" r={R3} stroke="#0f172a" strokeWidth="5" fill="none" />
          {/* Outer main ring */}
          <motion.circle cx="112" cy="112" r={R1}
            stroke="url(#scoreGrad)" strokeWidth="14" fill="none"
            strokeDasharray={CIRC(R1)}
            initial={{ strokeDashoffset: CIRC(R1) }}
            animate={{ strokeDashoffset: OFFSET(R1, pct) }}
            transition={{ duration: 2.2, ease: 'easeOut' }}
            strokeLinecap="round" filter="url(#glow)"
          />
          {/* Mid ring (75% of score) */}
          <motion.circle cx="112" cy="112" r={R2}
            stroke="url(#ring2Grad)" strokeWidth="8" fill="none"
            strokeDasharray={CIRC(R2)}
            initial={{ strokeDashoffset: CIRC(R2) }}
            animate={{ strokeDashoffset: OFFSET(R2, Math.min(pct + 0.1, 1)) }}
            transition={{ duration: 2.5, ease: 'easeOut', delay: 0.2 }}
            strokeLinecap="round"
          />
          {/* Inner ring (trust ring) */}
          <motion.circle cx="112" cy="112" r={R3}
            stroke="url(#ring3Grad)" strokeWidth="5" fill="none"
            strokeDasharray={CIRC(R3)}
            initial={{ strokeDashoffset: CIRC(R3) }}
            animate={{ strokeDashoffset: OFFSET(R3, Math.min(pct + 0.15, 1)) }}
            transition={{ duration: 2.8, ease: 'easeOut', delay: 0.4 }}
            strokeLinecap="round"
          />
          {/* Tick marks */}
          {[0, 60, 120, 180, 240, 300].map((deg, i) => (
            <line key={i}
              x1="112" y1="8" x2="112" y2="18"
              stroke={`${color}40`} strokeWidth="2"
              transform={`rotate(${deg - 90} 112 112)`}
            />
          ))}
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
            className="text-[64px] font-black leading-none tracking-tighter"
            style={{ color, textShadow: `0 0 30px ${glowColor}` }}
          >{score}</motion.div>
          <span className="text-[10px] font-black tracking-[0.3em] text-gray-500">/ 900</span>
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-1 px-3 py-0.5 rounded-full text-[9px] font-black tracking-widest"
            style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}
          >{label}</motion.div>
        </div>
      </div>
    </div>
  );
}

function Chatbot({ scoreData }: { scoreData: any }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    { role: 'bot', text: "Hi! I'm your CreditPulse AI Advisor. Ask me anything about your credit score, loan eligibility, or how to improve your score! 🚀" }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startTour = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
          window.speechSynthesis.cancel();
          setIsSpeaking(false);
          return;
      }
      
      const scoreAmt = scoreData?.loanAmt ? scoreData.loanAmt.replace('₹', 'Rupees ') : 'a specific amount';
      const tourScript = `Hi there! I am your Credit Pulse A I Voice Assistant. 
        Let me guide you through the dashboard!
        On the left side of your screen, you can see the main animated Score Gauge. Your current business credit score is ${scoreData?.score || 'calculating'}, which puts you in the ${scoreData?.band || 'standard'} risk category.
        Right below the score gauge, you will find your Multi-Dimensional Risk Meter, and below that, the Feature Contributions, showing exactly how your G S T filings and U P I transactions impact this score.
        Looking slightly to the right, under the MAX LOAN FACILITY panel, you can see that based on our real-time calculations, you are eligible for up to ${scoreAmt}!
        You can navigate through the different tabs positioned prominently on the right hand side—like Revenue Intel, Sector Benchmarks, or Improve Score—to view interactive line charts and structured financial advice.
        If you have any questions, I'm right here in the chat.`;
        
      const play = () => {
          const utterance = new SpeechSynthesisUtterance(tourScript);
          const voices = window.speechSynthesis.getVoices();
          // Find female voice signatures usually available on Windows and Chrome
          const femaleVoice = voices.find(v => v.name.includes('Zira') || v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Victoria'));
          if (femaleVoice) {
              utterance.voice = femaleVoice;
          }
          
          utterance.rate = 0.95;
          utterance.pitch = 1.35; // Increased pitch for higher feminine register
          utterance.volume = 1;
          
          utterance.onstart = () => setIsSpeaking(true);
          utterance.onend = () => setIsSpeaking(false);
          utterance.onerror = (e) => { console.error(e); setIsSpeaking(false); };
          
          window.speechSynthesis.speak(utterance);
      };

      if (window.speechSynthesis.getVoices().length === 0) {
          window.speechSynthesis.onvoiceschanged = () => {
              play();
              window.speechSynthesis.onvoiceschanged = null;
          };
      } else {
          play();
      }
    } else {
      alert("Text-to-speech is not supported in your browser.");
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(p => [...p, { role: 'user', text: userMsg }]);
    setTyping(true);

    try {
      const res = await fetch(`${API}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          score: scoreData?.score,
          band: scoreData?.band,
          loan: scoreData?.loanAmt
        })
      });
      const data = await res.json();
      setMessages(p => [...p, { role: 'bot', text: data.response || "I'm analyzing that for you..." }]);
    } catch {
      // Fallback responses
      const fallbacks: Record<string, string> = {
        'score': `Your current CreditPulse score is **${scoreData?.score || 'N/A'}** out of 900. This is computed from your GST filings, UPI velocity, and cash flow patterns.`,
        'loan': `Based on your score of **${scoreData?.score || 'N/A'}**, you are eligible for **${scoreData?.loanAmt || 'N/A'}** in loan facilities.`,
        'improve': "The fastest way to improve your score is to file GST returns on time and increase UPI transaction frequency. Check the 'Improve Score' tab for your personalized 5-step plan!",
        'gstin': "GSTIN is your 15-digit GST registration number. Your GST filing history is one of the strongest signals in your CreditPulse score.",
        'upi': "UPI Velocity measures how consistently and frequently your business receives/sends UPI payments — a key indicator of business health.",
      };
      const matchKey = Object.keys(fallbacks).find(k => userMsg.toLowerCase().includes(k));
      setMessages(p => [...p, {
        role: 'bot',
        text: matchKey ? fallbacks[matchKey] : "Great question! I can explain your score, suggest improvements, or help with loan eligibility. Try asking specifically about any of those topics!"
      }]);
    }
    setTyping(false);
  };

  return (
    <>
      {/* FAB */}
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-500/30"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="w-7 h-7 text-white" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-black animate-pulse" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="fixed bottom-28 right-8 z-50 w-96 h-[520px] glass border border-cyan-500/20 rounded-3xl flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-cyan-500/10 to-blue-600/10">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isSpeaking ? 'bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-pulse' : 'bg-gradient-to-br from-cyan-400 to-blue-600'}`}>
                  {isSpeaking ? <Mic className="w-5 h-5 text-black fill-current animate-bounce" /> : <Zap className="w-5 h-5 text-black fill-current" />}
                </div>
                <div>
                  <p className="font-black text-sm tracking-tighter">CreditPulse AI Advisor</p>
                  <p className={`text-[10px] font-bold ${isSpeaking ? 'text-cyan-400 animate-pulse' : 'text-green-400'}`}>
                      {isSpeaking ? '● Speaking Tour...' : '● Online'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <button onClick={startTour} className={`flex items-center gap-1.5 text-[9px] px-2.5 py-1.5 rounded-lg font-black tracking-widest transition-all ${isSpeaking ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30'}`}>
                    {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    {isSpeaking ? 'STOP' : 'TOUR MVP'}
                 </button>
                 <button onClick={() => { setOpen(false); if(isSpeaking) { window.speechSynthesis?.cancel(); setIsSpeaking(false); } }} className="text-gray-500 hover:text-white transition-colors ml-1"><X className="w-5 h-5" /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-cyan-500 text-black font-bold rounded-br-sm'
                      : 'glass border border-white/5 text-gray-200 rounded-bl-sm'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="glass border border-white/5 px-4 py-3 rounded-2xl rounded-bl-sm">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick Suggestions */}
            <div className="px-4 pb-2 flex gap-2 flex-wrap">
              {['How is score calculated?', 'What loan can I get?', 'How to improve?'].map(s => (
                <button key={s} onClick={() => { setInput(s); }} className="text-[10px] bg-white/5 hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 px-3 py-1 rounded-full transition-all font-medium">
                  {s}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/5 flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about your score..."
                className="flex-1 bg-white/5 rounded-xl px-4 py-2.5 text-sm outline-none text-white placeholder-gray-600"
              />
              <button onClick={sendMessage} className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center hover:bg-cyan-400 transition-colors">
                <Send className="w-4 h-4 text-black" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
export default function Home() {
  const [gstin, setGstin] = useState('');
  const [upiId, setUpiId] = useState('');
  const [activeInput, setActiveInput] = useState<'gstin' | 'upi'>('gstin');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('score');
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [verifyData, setVerifyData] = useState<any>(null);
  const [verifying, setVerifying] = useState(false);
  const [liveInsight, setLiveInsight] = useState<string | null>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (view === 'dashboard' && data && data.score) {
      interval = setInterval(async () => {
        try {
          const reqId = data.gstin || (activeInput === 'gstin' ? gstin : '27AAPFU0939F1ZV');
          const res = await fetch(`${API}/live-update/${reqId}?current_score=${data.score}`);
          if (res.ok) {
            const liveData = await res.json();
            if (liveData.score_delta !== 0) {
              setData((prev: any) => ({ ...prev, score: liveData.new_score, loanAmt: liveData.new_loan_amount || prev.loanAmt, timestamp: liveData.timestamp }));
              setLiveInsight(liveData.insight);
            }
          } else {
             // Fake micro-fluctuation if API fails
             const shift = Math.floor(Math.random() * 5) - 2;
             if (shift !== 0) {
                 setData((prev: any) => {
                     const newScore = Math.min(900, Math.max(300, prev.score + shift));
                     const newLoan = `₹${(1.0 + ((newScore - 300) / 600.0) * 9.0).toFixed(1)} Lakhs`;
                     return { ...prev, score: newScore, loanAmt: newLoan, timestamp: new Date().toLocaleString('en-IN') };
                 });
                 setLiveInsight(shift > 0 ? `+${shift} pts: Positive signal detected` : `${shift} pts: Minor risk fluctuation`);
             }
          }
        } catch (e) {
             const shift = Math.floor(Math.random() * 5) - 2;
             if (shift !== 0) {
                 setData((prev: any) => {
                     const newScore = Math.min(900, Math.max(300, prev.score + shift));
                     const newLoan = `₹${(1.0 + ((newScore - 300) / 600.0) * 9.0).toFixed(1)} Lakhs`;
                     return { ...prev, score: newScore, loanAmt: newLoan, timestamp: new Date().toLocaleString('en-IN') };
                 });
                 setLiveInsight(shift > 0 ? `+${shift} pts: Positive signal detected` : `${shift} pts: Minor risk fluctuation`);
             }
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [view, data?.score, activeInput, gstin]);

  // Auto-verify GSTIN when it reaches 15 chars
  useEffect(() => {
    if (gstin.length === 15 && activeInput === 'gstin') {
      setVerifying(true);
      setVerifyData(null);
      fetch(`${API}/verify-gstin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gstin }),
      })
        .then(r => r.json())
        .then(d => { setVerifyData(d); setVerifying(false); })
        .catch(() => {
          // Demo fallback for offline
          const isKnown = ['27AAPFU0939F1ZV','29GGGGG1314R9Z6','07AAACC1206D1ZM'].includes(gstin);
          setVerifyData({
            gstin,
            status: 'VALID',
            filing_status: 'ACTIVE',
            verification_source: 'DEMO_FALLBACK',
            data_confidence: isKnown ? 1.0 : 0.72,
            inferred: !isKnown,
            response_time_ms: 42,
            entity: {
              legal_name: isKnown ? 'Lakshmi Food Industries Pvt Ltd' : 'Inferred Business Entity',
              trade_name: isKnown ? 'Lakshmi Foods' : 'Inferred Trade',
              business_type: 'Private Limited Company',
              state: gstin.slice(0,2) === '27' ? 'Maharashtra' : gstin.slice(0,2) === '29' ? 'Karnataka' : 'Delhi',
              city: gstin.slice(0,2) === '27' ? 'Pune' : gstin.slice(0,2) === '29' ? 'Bengaluru' : 'New Delhi',
              sector: 'Manufacturing',
              compliance_rating: isKnown ? 'A' : 'B+',
              risk_category: isKnown ? 'LOW' : 'MEDIUM',
              date_of_registration: '2016-03-15',
              years_active: 8,
              annual_turnover_band: '₹5Cr – ₹25Cr',
              last_return_filed: 'GSTR-3B Mar 2024',
              pan: gstin.slice(2, 12),
              entity_type: 'Company (Pvt / Public Ltd)',
              registration_type: 'Regular',
            },
            risk_flags: [{ severity: 'NONE', code: 'GREEN_STATUS', message: 'No adverse flags detected.', action: 'Proceed with KYC' }],
            validation: { valid: true, checksum_valid: true, errors: [], warnings: [] },
          });
          setVerifying(false);
        });
    } else if (gstin.length < 15) {
      setVerifyData(null);
      setVerifying(false);
    }
  }, [gstin, activeInput]);

  const fetchScore = async () => {
    const id = activeInput === 'gstin' ? gstin : '27AAPFU0939F1ZV'; // map UPI to known GSTIN for demo
    if (activeInput === 'gstin' && (!id || id.length !== 15)) {
      alert('Please enter a valid 15-character GSTIN.');
      return;
    }
    setLoading(true);
    setData(null);
    try {
      const res = await fetch(`${API}/get-credit-score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gstin: id }),
      });
      const result = await res.json();
      if (res.ok) {
        setData({
          score: result.credit_score,
          band: result.risk_band,
          loanAmt: result.recommended_loan_amount,
          name: result.business_name,
          timestamp: result.timestamp,
          freshness: result.freshness_label,
          reasons: result.top_reasons,
          benchmark: result.sector_benchmark,
          contributions: result.feature_contributions,
          trend: result.score_trend,
          details: result.details,
          loanEligibility: result.loan_eligibility,
          improvementPlan: result.improvement_plan,
          anomalies: result.anomalies,
          fraud: result.fraud_signals,
          signals: result.data_signals_used,
          confidence: result.confidence_score,
          revenue_analytics: result.revenue_analytics,
          risk_meter: result.risk_meter,
          gstin: result.gstin,
        });
        setActiveTab('score');
        setView('dashboard');
      } else {
        alert(result.detail || 'Error fetching score');
      }
    } catch {
      // Demo fallback
      const fallbackScore = id === '27AAPFU0939F1ZV' ? 785 : id === '29GGGGG1314R9Z6' ? 720 : 621;
      setData({
        score: fallbackScore,
        band: fallbackScore > 750 ? 'LOW RISK' : fallbackScore > 600 ? 'MEDIUM RISK' : 'HIGH RISK',
        loanAmt: `₹${(1.0 + ((fallbackScore - 300) / 600.0) * 9.0).toFixed(1)} Lakhs`,
        name: id === '27AAPFU0939F1ZV' ? 'Lakshmi Food Industries Pvt Ltd' : 'TechNova Solutions LLP',
        timestamp: new Date().toLocaleString('en-IN'),
        freshness: 'DEMO MODE · Offline Simulation',
        reasons: fallbackScore > 750 ? [
          { text: '100% GST filing compliance over last 12 months', type: 'success' },
          { text: 'UPI transaction velocity growing +22% QoQ', type: 'success' },
          { text: 'Low customer concentration — no single buyer >30% revenue', type: 'success' },
          { text: 'Zero payment defaults or GST notices', type: 'success' },
          { text: 'Strong and consistent e-way bill generation', type: 'success' },
        ] : [
          { text: '92% GST filing consistency — minor delays detected', type: 'warning' },
          { text: 'Stable UPI cash flow with seasonal fluctuations', type: 'success' },
          { text: 'Sector-wide slowdown impacting revenue growth', type: 'warning' },
          { text: 'Normal credit utilization with manageable debt ratio', type: 'success' },
          { text: 'Valid registrations and certifications in good standing', type: 'success' },
        ],
        benchmark: { sector_avg_score: 650, percentile: fallbackScore > 750 ? 92 : 68, points_vs_avg: fallbackScore - 650, peer_position: fallbackScore > 750 ? 'TOP QUARTILE' : 'ABOVE AVERAGE', sector: 'IT & Software', businesses_analyzed: 28400 },
        contributions: [
          { label: 'GST Compliance', value: 82, is_positive: true },
          { label: 'UPI Velocity', value: 56, is_positive: true },
          { label: 'E-Way Bill Activity', value: 44, is_positive: true },
          { label: 'Revenue Stability', value: 38, is_positive: fallbackScore < 700 },
          { label: 'Customer Risk', value: 29, is_positive: true },
          { label: 'Growth Rate', value: 22, is_positive: true },
        ],
        trend: ['Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct'].map((m, i) => ({
          month: m, score: Math.max(300, Math.min(900, fallbackScore + Math.floor(Math.sin(i) * 40)))
        })),
        details: { sector: 'IT & Software', state: 'Karnataka', city: 'Bengaluru', years_in_business: '4', employee_count: '10-50', registration_type: 'LLP' },
        loanEligibility: {
          tier: fallbackScore > 750 ? 'PREMIUM' : 'STANDARD',
          message: fallbackScore > 750 ? 'Excellent profile. Eligible for premium NBFC and bank products.' : 'Good profile. Eligible for NBFC products.',
          eligible_products: [
            { type: 'Business Term Loan', amount: '₹50L – ₹2Cr', rate: '10.5% – 13%', tenure: 'Up to 5 years', eligible: fallbackScore > 750 },
            { type: 'Working Capital OD', amount: 'Up to ₹1Cr', rate: '12% – 14%', tenure: 'Annual renewal', eligible: true },
            { type: 'GST Invoice Discounting', amount: '80% of invoice', rate: '14% – 16%', tenure: '90 days', eligible: true },
            { type: 'Equipment Finance', amount: '₹10L – ₹75L', rate: '11%', tenure: '3 years', eligible: fallbackScore > 720 },
          ],
          ready_for_nbfc: true,
          ready_for_bank: fallbackScore > 750,
        },
        improvementPlan: [
          { action: 'File GST Returns on Time', impact: '+30 to +50 pts', timeline: '3 months', priority: 'critical', detail: 'Consistent GST filing is the highest-weighted factor. File by the 20th of every month.' },
          { action: 'Increase UPI Transaction Frequency', impact: '+20 to +35 pts', timeline: '2 months', priority: 'high', detail: 'Use UPI for all business receipts and payments to signal strong business operations.' },
          { action: 'Diversify Your Customer Base', impact: '+15 to +25 pts', timeline: '6 months', priority: 'high', detail: 'Ensure no single customer exceeds 30% of revenue to reduce concentration risk.' },
          { action: 'Generate E-Way Bills Consistently', impact: '+10 to +20 pts', timeline: '1 month', priority: 'medium', detail: 'E-way bill consistency signals actual business activity to our AI engine.' },
          { action: 'Maintain Minimum Average Bank Balance', impact: '+10 to +15 pts', timeline: '3 months', priority: 'medium', detail: 'Target 2x your average monthly expense as a financial buffer.' },
        ],
        anomalies: fallbackScore < 650 ? [{ type: 'SCORE_DROP', severity: 'MEDIUM', title: 'Score Decline Detected', detail: 'Score dropped vs. prior quarter peak. Investigate GST filing delays.', detected_on: 'Last 90 days' }] : [],
        fraud: { circular_trading_detected: false, fraud_probability: 0.06, flag: 'CLEAR', network_centrality: 0.12 },
        signals: ['GST Return Filings', 'UPI Transaction Velocity', 'E-Way Bill Frequency', 'Cash Flow Volatility Index', 'Network Fraud Graph', 'Sector Benchmarks'],
        confidence: 0.94,
        revenue_analytics: {
          yearly_revenue: fallbackScore * 100000,
          monthly_avg: (fallbackScore * 100000) / 12,
          projected_yearly: (fallbackScore * 100000) * 1.15,
          financial_kpis: {
            avg_ticket_size: fallbackScore * 50,
            transaction_velocity: fallbackScore / 5,
            operating_margin: 0.18,
            growth_rate_yoy: 15.4,
            debt_service_ratio: 2.1,
            burn_rate: (fallbackScore * 100000 / 12) * 0.8
          },
          ai_insights: [
            "Revenue shows consistent organic growth trends.",
            "Strong seasonal spikes detected in Q4.",
            "Low volatility in monthly cash flow patterns."
          ],
          monthly_breakdown: ['Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct'].map((m, i) => ({
            month: m,
            revenue: ((fallbackScore * 100000) / 12) * (1 + Math.sin(i) * 0.2),
            transactions: Math.floor(fallbackScore / 10 + Math.random() * 20),
            growth_mom: 1.2
          }))
        },
        risk_meter: [
            { name: "Cash Flow Volatility", value: fallbackScore < 600 ? 55 : 20, level: fallbackScore < 600 ? "Medium" : "Low", color: fallbackScore < 600 ? "#f59e0b" : "#22d3ee" },
            { name: "Dependency Risk", value: fallbackScore < 650 ? 65 : 25, level: fallbackScore < 650 ? "High" : "Low", color: fallbackScore < 650 ? "#ef4444" : "#22d3ee" },
            { name: "Fraud Probability", value: 6, level: "Low", color: "#22d3ee" },
            { name: "Leverage Ratio", value: 45, level: "Medium", color: "#f59e0b" }
        ],
        gstin: id
      });
      setActiveTab('score');
      setView('dashboard');
    }
    setLoading(false);
  };

  const goBack = () => {
    setView('landing');
    setData(null);
    setGstin('');
    setUpiId('');
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-grid text-white selection:bg-cyan-500 selection:text-white overflow-hidden">
      {/* Background always present */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-15%] left-[-5%] w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-blue-600/8 rounded-full blur-[100px]" />
      </div>

      <AnimatePresence mode="wait">

      {/* ════════════ LANDING PAGE ════════════ */}
      {view === 'landing' && (
        <motion.div key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, x: -80 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 min-h-screen flex flex-col"
        >
          {/* Navbar */}
          <nav className="sticky top-0 z-40 backdrop-blur-xl border-b border-white/5 px-6 md:px-12 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <Zap className="text-black w-6 h-6 fill-current" />
                </div>
                <div>
                  <span className="text-xl font-black tracking-tighter text-glow">CREDITPULSE</span>
                  <span className="ml-2 text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded font-bold tracking-widest">v2.0</span>
                </div>
              </div>
              <div className="hidden md:flex gap-6 text-xs font-bold text-gray-500">
                <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-cyan-500" /> NBFC-Ready</span>
                <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-green-500" /> RBI Compliant</span>
                <span className="flex items-center gap-1.5"><Server className="w-3.5 h-3.5 text-purple-400" /> API Active</span>
              </div>
            </div>
          </nav>

          {/* Hero */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-black tracking-widest px-4 py-2 rounded-full mb-8">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                REAL-TIME AI CREDIT SCORING FOR INDIAN MSMEs
              </div>
              <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter leading-[1.0]">
                UNLOCK CREDIT WITH
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                  ALTERNATIVE SIGNALS
                </span>
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed mb-12">
                No formal credit history? No problem. CreditPulse scores 80% of rejected MSMEs
                using <span className="text-cyan-400 font-semibold">GST filings, UPI velocity &amp; cash flow intelligence</span>.
              </p>
            </motion.div>

            {/* Input Tabs */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="w-full max-w-2xl">
              <div className="flex justify-center mb-5 gap-2">
                {(['gstin', 'upi'] as const).map(t => (
                  <button key={t} onClick={() => setActiveInput(t)}
                    className={`px-6 py-2 rounded-full text-xs font-black tracking-widest uppercase transition-all ${
                      activeInput === t
                        ? t === 'gstin' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30' : 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                        : 'glass text-gray-500 hover:text-white'
                    }`}
                  >{t === 'gstin' ? 'GST ID' : 'UPI ID'}</button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={activeInput} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <motion.div
                    className={`glass p-2 rounded-2xl flex gap-3 shadow-2xl relative overflow-hidden border ${activeInput === 'gstin' ? 'border-cyan-500/20' : 'border-purple-500/20'}`}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className={`flex items-center pl-4 text-xs font-black tracking-widest ${activeInput === 'gstin' ? 'text-cyan-400' : 'text-purple-400'}`}>
                      {activeInput === 'gstin' ? 'GST' : 'UPI'}
                    </div>
                    {activeInput === 'gstin' ? (
                      <input type="text" placeholder="ENTER 15-DIGIT GSTIN"
                        className="flex-1 bg-transparent px-3 py-4 outline-none text-cyan-400 font-mono tracking-widest text-lg placeholder-gray-600"
                        value={gstin} onChange={e => setGstin(e.target.value.toUpperCase())} maxLength={15}
                      />
                    ) : (
                      <input type="text" placeholder="name@upi or business@okicici"
                        className="flex-1 bg-transparent px-3 py-4 outline-none text-purple-400 font-mono tracking-wider text-lg placeholder-gray-600"
                        value={upiId} onChange={e => setUpiId(e.target.value.toLowerCase())}
                      />
                    )}
                    {activeInput === 'gstin' && (
                      <span className={`self-center mr-1 text-[10px] font-bold ${gstin.length === 15 ? 'text-green-400' : 'text-gray-700'}`}>{gstin.length}/15</span>
                    )}
                    <button onClick={fetchScore} disabled={loading}
                      className={`px-8 py-4 rounded-xl font-black tracking-tighter transition-all flex items-center gap-2 disabled:opacity-50 group ${
                        activeInput === 'gstin' ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/20' : 'bg-purple-500 hover:bg-purple-400 text-white shadow-lg shadow-purple-500/20'
                      }`}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> COMPUTING...</span>
                      ) : (
                        <span className="flex items-center gap-2">ANALYZE <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
                      )}
                    </button>
                  </motion.div>

                  <div className="flex gap-3 justify-center mt-4 flex-wrap">
                    <span className="text-[10px] text-gray-600 font-mono tracking-widest">SAMPLES →</span>
                    {activeInput === 'gstin'
                      ? ['27AAPFU0939F1ZV', '29GGGGG1314R9Z6', '07AAACC1206D1ZM'].map(id => (
                        <button key={id} onClick={() => setGstin(id)}
                          className="text-[10px] font-mono text-gray-600 hover:text-cyan-400 border border-gray-800 hover:border-cyan-500/40 px-3 py-1 rounded-lg transition-all"
                        >{id}</button>
                      ))
                      : ['lakshmi.foods@okicici', 'technova.sol@oksbi', 'delhimart@okaxis'].map(id => (
                        <button key={id} onClick={() => setUpiId(id)}
                          className="text-[10px] font-mono text-gray-600 hover:text-purple-400 border border-gray-800 hover:border-purple-500/40 px-3 py-1 rounded-lg transition-all"
                        >{id}</button>
                      ))
                    }
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Footer hint */}
          <div className="text-center pb-4">
            <p className="text-[10px] tracking-[0.3em] text-gray-700 font-mono">CREDITPULSE ENGINE v2.0 · NBFC-READY · RBI COMPLIANT · REAL-TIME AI SCORING</p>
          </div>

          {/* ── LIVE GSTIN VERIFICATION PANEL ── */}
          <div className="w-full max-w-2xl mx-auto px-6 pb-10">
            <AnimatePresence>
              {verifying && (
                <motion.div key="verifying" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="rounded-2xl p-4 flex items-center gap-3"
                  style={{ background: 'rgba(34,211,238,0.04)', border: '1px solid rgba(34,211,238,0.15)' }}
                >
                  <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
                  <span className="text-xs text-cyan-400 font-black tracking-widest">VERIFYING GSTIN WITH GST PORTAL...</span>
                </motion.div>
              )}

              {verifyData && !verifying && (
                <motion.div key="verified" initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
                    border: verifyData.status === 'VALID' ? '1px solid rgba(34,211,238,0.25)' : '1px solid rgba(239,68,68,0.3)',
                    boxShadow: verifyData.status === 'VALID' ? '0 0 30px rgba(34,211,238,0.06)' : '0 0 30px rgba(239,68,68,0.06)',
                  }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-3 border-b"
                    style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" style={{ color: verifyData.status === 'VALID' ? '#22d3ee' : '#f87171' }} />
                      <span className="text-[10px] font-black tracking-[0.25em] text-gray-400">GST VERIFICATION RESULT</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-gray-600 font-mono">{verifyData.response_time_ms}ms</span>
                      <div className={`px-2.5 py-1 rounded-lg text-[9px] font-black tracking-widest ${
                        verifyData.status === 'VALID'
                          ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                          : 'bg-red-500/15 text-red-400 border border-red-500/30'
                      }`}>
                        {verifyData.status === 'VALID' ? '✓ VERIFIED' : '✗ INVALID'}
                      </div>
                      {verifyData.inferred && (
                        <div className="px-2 py-1 rounded-lg text-[9px] font-black tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          AI INFERRED
                        </div>
                      )}
                    </div>
                  </div>

                  {verifyData.entity && (
                    <div className="p-5">
                      {/* Business Name */}
                      <div className="mb-4">
                        <div className="text-[8px] text-gray-600 tracking-[0.3em] font-bold mb-1">REGISTERED LEGAL NAME</div>
                        <div className="text-xl font-black tracking-tighter text-white">{verifyData.entity.legal_name}</div>
                        {verifyData.entity.trade_name && (
                          <div className="text-[10px] text-gray-500 mt-0.5">Trade Name: {verifyData.entity.trade_name}</div>
                        )}
                      </div>

                      {/* Key grid */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {[
                          { label: 'STATE', val: verifyData.entity.state },
                          { label: 'SECTOR', val: verifyData.entity.sector },
                          { label: 'ENTITY TYPE', val: verifyData.entity.business_type?.split(' ')[0] || '—' },
                          { label: 'COMPLIANCE', val: verifyData.entity.compliance_rating || '—',
                            color: ['A+','A'].includes(verifyData.entity.compliance_rating) ? '#4ade80' : ['B+','B'].includes(verifyData.entity.compliance_rating) ? '#fbbf24' : '#f87171' },
                          { label: 'RISK LEVEL', val: verifyData.entity.risk_category || '—',
                            color: verifyData.entity.risk_category === 'LOW' ? '#4ade80' : verifyData.entity.risk_category === 'MEDIUM' ? '#fbbf24' : '#f87171' },
                          { label: 'ACTIVE YRS', val: `${verifyData.entity.years_active} YRS` },
                        ].map((item: any, i: number) => (
                          <div key={i} className="rounded-xl p-3"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div className="text-[8px] text-gray-600 tracking-widest font-bold mb-1">{item.label}</div>
                            <div className="text-xs font-black" style={{ color: item.color || '#e5e7eb' }}>{item.val}</div>
                          </div>
                        ))}
                      </div>

                      {/* Filing strip */}
                      <div className="flex items-center gap-3 flex-wrap mb-3">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500">
                          <div className={`w-1.5 h-1.5 rounded-full ${verifyData.filing_status === 'ACTIVE' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                          FILING: <span style={{ color: verifyData.filing_status === 'ACTIVE' ? '#4ade80' : '#f87171' }}>{verifyData.filing_status}</span>
                        </div>
                        <div className="text-[10px] text-gray-600 font-mono">PAN: {verifyData.entity.pan}</div>
                        <div className="text-[10px] text-gray-600">Last Filed: {verifyData.entity.last_return_filed}</div>
                        <div className="ml-auto text-[9px] text-gray-700 font-mono">Source: {verifyData.verification_source}</div>
                      </div>

                      {/* Risk flags */}
                      {verifyData.risk_flags?.map((f: any, i: number) => (
                        <div key={i} className="flex items-start gap-2 rounded-xl px-3 py-2.5 text-[10px]"
                          style={{
                            background: f.severity === 'CRITICAL' ? 'rgba(239,68,68,0.1)' : f.severity === 'HIGH' ? 'rgba(239,68,68,0.06)' : f.severity === 'MEDIUM' ? 'rgba(245,158,11,0.06)' : 'rgba(34,197,94,0.06)',
                            border: `1px solid ${f.severity === 'CRITICAL' ? 'rgba(239,68,68,0.3)' : f.severity === 'NONE' ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.2)'}`,
                          }}
                        >
                          {f.severity === 'NONE' ? <CheckCircle className="w-3.5 h-3.5 text-green-400 mt-0.5 flex-shrink-0" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />}
                          <div>
                            <span className="font-black" style={{ color: f.severity === 'NONE' ? '#4ade80' : f.severity === 'CRITICAL' ? '#f87171' : '#fbbf24' }}>[{f.code}] </span>
                            <span className="text-gray-400">{f.message}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {verifyData.status === 'INVALID' && !verifyData.entity && (
                    <div className="p-5 text-center">
                      <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-2" />
                      <p className="text-red-400 font-black">GSTIN VALIDATION FAILED</p>
                      <p className="text-gray-600 text-xs mt-1">{verifyData.validation?.errors?.join(' | ')}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </motion.div>
      )}

      {/* ════════════ DASHBOARD PAGE ════════════ */}
      {view === 'dashboard' && data && (
        <motion.div key="dashboard"
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 80 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative z-10 min-h-screen flex flex-col pb-32"
        >
          {/* Dashboard Navbar */}
          <nav className="sticky top-0 z-40 backdrop-blur-xl border-b border-white/5 px-6 py-3">
            <div className="max-w-7xl mx-auto flex items-center gap-4">
              <button onClick={goBack}
                className="flex items-center gap-2 text-xs font-black text-gray-500 hover:text-cyan-400 transition-colors glass px-4 py-2 rounded-xl border border-white/5"
              >
                <ArrowRight className="w-4 h-4 rotate-180" /> BACK
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                  <Zap className="text-black w-4 h-4 fill-current" />
                </div>
                <span className="font-black tracking-tighter">CREDITPULSE</span>
                <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded font-bold tracking-widest">DASHBOARD</span>
              </div>
              <div className="ml-auto flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  LIVE SESSION
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${data.score >= 750 ? 'bg-green-500/15 text-green-400 border border-green-500/30' : data.score >= 600 ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'bg-red-500/15 text-red-400 border border-red-500/30'}`}>
                  {data.band}
                </div>
              </div>
            </div>
          </nav>

          {/* Business Header */}
          <div className="px-6 pt-6 pb-4 max-w-7xl mx-auto w-full">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="rounded-3xl p-6 flex items-center justify-between flex-wrap gap-4 mb-6"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div>
                <h2 className="text-2xl font-black tracking-tighter">{data.name}</h2>
                <p className="text-sm text-gray-500 mt-1">{data.details?.city}, {data.details?.state} · {data.details?.sector} · {data.details?.registration_type}</p>
              </div>
              <div className="flex items-center gap-6 flex-wrap">
                <div className="text-right">
                  <div className="text-[9px] text-gray-600 tracking-widest">YEARS IN BUSINESS</div>
                  <div className="text-lg font-black text-white">{data.details?.years_in_business}+ YRS</div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] text-gray-600 tracking-widest">EMPLOYEES</div>
                  <div className="text-lg font-black text-white">{data.details?.employee_count}</div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] text-gray-600 tracking-widest">DATA FRESHNESS</div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-green-400"><div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />{data.freshness}</div>
                </div>
              </div>
            </motion.div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
              {TABS.map(t => {
                const Icon = t.icon;
                return (
                  <button key={t.key} onClick={() => setActiveTab(t.key)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black tracking-wider whitespace-nowrap transition-all ${
                      activeTab === t.key ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'glass text-gray-500 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />{t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab content */}
          <div className="px-6 max-w-7xl mx-auto w-full">
            {/* ── TAB: SCORE REPORT ── */}
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

                {activeTab === 'score' && (
                  <div className="grid md:grid-cols-12 gap-6">

                    {/* ── PREMIUM SCORE CARD ── */}
                    <div className="md:col-span-4 flex flex-col gap-4">

                      {/* Main Score Glass Card */}
                      <div className="relative rounded-[2rem] p-6 flex flex-col items-center gap-4 overflow-hidden"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                          backdropFilter: 'blur(24px)',
                          border: '1px solid rgba(255,255,255,0.07)',
                          boxShadow: data.score >= 750
                            ? '0 0 60px rgba(34,211,238,0.08), inset 0 1px 0 rgba(255,255,255,0.06)'
                            : '0 0 60px rgba(245,158,11,0.08), inset 0 1px 0 rgba(255,255,255,0.06)'
                        }}
                      >
                        {/* Subtle background grid */}
                        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #22d3ee 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                        {/* Live indicator */}
                        <div className="absolute top-4 right-4 flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                          <span className="text-[9px] font-black tracking-widest text-green-400">LIVE</span>
                        </div>

                        {/* AI Insight Chip */}
                        <AnimatePresence mode="popLayout">
                          <motion.div
                            key={liveInsight || 'initial'}
                            initial={{ opacity: 0, scale: 0.8, y: -8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.5 }}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black tracking-wider shadow-lg"
                            style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa', boxShadow: '0 0 15px rgba(139,92,246,0.2)' }}
                          >
                            <Zap className="w-3 h-3 fill-current" />
                            {liveInsight || (data.score >= 750 ? 'Top 8% in your sector' : data.score >= 600 ? 'Score improved +12 this month' : 'Action needed — see plan')}
                          </motion.div>
                        </AnimatePresence>

                        <ScoreGauge score={data.score} />

                        {/* ── DOMINANT LOAN FACILITY CARD ── */}
                        <div className="w-full rounded-2xl relative overflow-hidden"
                          style={{
                            background: 'linear-gradient(135deg, rgba(6,182,212,0.08) 0%, rgba(99,102,241,0.06) 100%)',
                            border: '1px solid rgba(34,211,238,0.25)',
                            boxShadow: '0 0 40px rgba(34,211,238,0.08), inset 0 1px 0 rgba(34,211,238,0.1)',
                          }}
                        >
                          {/* Animated corner glow */}
                          <div className="absolute top-0 right-0 w-28 h-28 rounded-full blur-3xl pointer-events-none"
                            style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.2), transparent 70%)' }} />
                          <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full blur-2xl pointer-events-none"
                            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)' }} />

                          <div className="relative p-5">
                            {/* Header row */}
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(180deg,#22d3ee,#6366f1)' }} />
                                <span className="text-[9px] font-black tracking-[0.3em] text-gray-400">MAX LOAN FACILITY</span>
                              </div>
                              {/* Tier badge */}
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.0 }}
                                className="px-2.5 py-1 rounded-lg text-[9px] font-black tracking-widest"
                                style={{
                                  background: data.score >= 750 ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)',
                                  border: `1px solid ${data.score >= 750 ? 'rgba(34,197,94,0.4)' : 'rgba(245,158,11,0.4)'}`,
                                  color: data.score >= 750 ? '#4ade80' : '#fbbf24',
                                }}
                              >
                                {data.score >= 750 ? '✦ PREMIUM' : data.score >= 600 ? '◈ STANDARD' : '◇ BASIC'}
                              </motion.div>
                            </div>

                            {/* Main amount — BIG & DOMINANT */}
                            <motion.div
                              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, type: 'spring' }}
                              className="mb-1"
                            >
                              <div className="text-[42px] font-black leading-none tracking-tighter"
                                style={{
                                  color: '#22d3ee',
                                  textShadow: '0 0 40px rgba(34,211,238,0.6), 0 0 80px rgba(34,211,238,0.2)',
                                  fontVariantNumeric: 'tabular-nums',
                                }}
                              >
                                {data.loanAmt}
                              </div>
                              <div className="text-[10px] text-gray-600 font-mono tracking-widest mt-0.5">
                                {data.score >= 750 ? 'UP TO ₹10 LAKHS ELIGIBLE · SECURED & UNSECURED' : 'UP TO ₹10 LAKHS ELIGIBLE · UNSECURED'}
                              </div>
                            </motion.div>

                            {/* Key metrics row */}
                            <div className="flex gap-3 mt-3 mb-4">
                              {[
                                { label: 'INTEREST', val: data.score >= 750 ? '10.5%' : data.score >= 600 ? '13%' : '16%', sub: 'p.a. from' },
                                { label: 'TENURE', val: data.score >= 750 ? '5 YRS' : '3 YRS', sub: 'max term' },
                                { label: 'EST. EMI', val: data.score >= 750 ? '₹2.1L' : data.score >= 600 ? '₹89K' : '₹35K', sub: 'per month' },
                              ].map((m, i) => (
                                <motion.div key={i}
                                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + i * 0.1 }}
                                  className="flex-1 rounded-xl p-2.5 text-center"
                                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                                >
                                  <div className="text-[8px] text-gray-600 tracking-widest font-bold">{m.label}</div>
                                  <div className="text-sm font-black text-white mt-0.5">{m.val}</div>
                                  <div className="text-[8px] text-gray-700">{m.sub}</div>
                                </motion.div>
                              ))}
                            </div>

                            {/* Multi-segment eligibility bar */}
                            <div className="space-y-1.5">
                              <div className="flex justify-between text-[9px] font-black tracking-widest">
                                <span className="text-gray-600">CREDIT UTILIZATION</span>
                                <span style={{ color: '#22d3ee' }}>{Math.round(((data.score - 300) / 600) * 100)}% eligible</span>
                              </div>
                              <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                                <motion.div
                                  className="h-full rounded-full relative overflow-hidden"
                                  style={{ background: 'linear-gradient(90deg, #0e7490 0%, #0891b2 40%, #22d3ee 70%, #a5f3fc 100%)' }}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${((data.score - 300) / 600) * 100}%` }}
                                  transition={{ duration: 2, ease: 'easeOut', delay: 0.8 }}
                                >
                                  {/* shimmer */}
                                  <motion.div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)' }}
                                    animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2, repeat: Infinity, delay: 2 }}
                                  />
                                </motion.div>
                              </div>
                              <div className="flex justify-between text-[8px] text-gray-700 font-mono">
                                <span>₹0</span><span>₹2.5L</span><span>₹5L</span><span>₹7.5L</span><span>₹10L</span>
                              </div>
                            </div>
                          </div>
                        </div>


                        {/* Smart Status Badges */}
                        <div className="w-full space-y-2">
                          {[
                            {
                              label: 'NBFC Ready', ok: data.loanEligibility?.ready_for_nbfc,
                              icon: <Globe className="w-3.5 h-3.5" />,
                              desc: data.loanEligibility?.ready_for_nbfc ? '12+ NBFCs available' : 'Score below threshold'
                            },
                            {
                              label: 'Bank Ready', ok: data.loanEligibility?.ready_for_bank,
                              icon: <CreditCard className="w-3.5 h-3.5" />,
                              desc: data.loanEligibility?.ready_for_bank ? 'PSB & Private Banks' : 'Need score ≥ 750'
                            },
                            {
                              label: 'Fraud Cleared', ok: data.fraud?.flag === 'CLEAR',
                              icon: <ShieldCheck className="w-3.5 h-3.5" />,
                              desc: data.fraud?.flag === 'CLEAR' ? `Risk: ${(data.fraud?.fraud_probability * 100).toFixed(1)}% (Safe)` : 'Circular txn detected'
                            },
                          ].map((item, idx) => (
                            <motion.div key={item.label}
                              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + idx * 0.1 }}
                              whileHover={{ scale: 1.02, x: 3 }}
                              className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-default transition-all"
                              style={{
                                background: item.ok ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)',
                                border: `1px solid ${item.ok ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
                              }}
                            >
                              <div className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
                                style={{ background: item.ok ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: item.ok ? '#4ade80' : '#f87171' }}>
                                {item.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-black tracking-widest" style={{ color: item.ok ? '#4ade80' : '#f87171' }}>{item.label}</p>
                                <p className="text-[9px] text-gray-600 truncate">{item.desc}</p>
                              </div>
                              <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                                style={{ background: item.ok ? '#4ade8020' : '#f8717120' }}>
                                {item.ok
                                  ? <CheckCircle className="w-3.5 h-3.5" style={{ color: '#4ade80' }} />
                                  : <X className="w-3.5 h-3.5" style={{ color: '#f87171' }} />
                                }
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {/* AI Confidence Meter */}
                        <div className="w-full">
                          <div className="flex justify-between text-[9px] font-black tracking-widest text-gray-600 mb-2">
                            <span>AI CONFIDENCE</span><span style={{ color: '#22d3ee' }}>{(data.confidence * 100).toFixed(0)}%</span>
                          </div>
                          <div className="h-1 w-full rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <motion.div className="h-full rounded-full"
                              style={{ background: 'linear-gradient(90deg, #6366f1, #22d3ee)', boxShadow: '0 0 8px rgba(34,211,238,0.5)' }}
                              initial={{ width: 0 }}
                              animate={{ width: `${data.confidence * 100}%` }}
                              transition={{ duration: 1.5, delay: 1.0 }}
                            />
                          </div>
                        </div>

                        {/* Timestamp */}
                        <p className="text-[9px] text-gray-700 font-mono tracking-widest text-center">{data.timestamp}</p>
                      </div>
                    </div>

                    {/* AI Reasons + Contributions */}
                    <div className="md:col-span-8 flex flex-col gap-6">
                      <div className="glass rounded-3xl p-6">
                        <div className="flex items-center gap-2 mb-5">
                          <ShieldCheck className="w-5 h-5 text-cyan-400" />
                          <h3 className="font-black text-lg tracking-tighter">AI SCORING RATIONALE</h3>
                          <span className="ml-auto text-[10px] text-gray-500 font-mono">SHAP v4.1 EXPLAINER</span>
                        </div>
                        <div className="space-y-3">
                          {data.reasons?.map((r: any, i: number) => (
                            <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.08 }}
                              className={`flex items-start gap-3 p-4 rounded-2xl border transition-all hover:translate-x-1 ${r.type === 'success' ? 'bg-green-500/5 border-green-500/15' : 'bg-amber-500/5 border-amber-500/15'}`}
                            >
                              <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${r.type === 'success' ? 'bg-green-500' : 'bg-amber-500'}`}>
                                {r.type === 'success' ? <CheckCircle className="w-3 h-3 text-black" /> : <AlertTriangle className="w-3 h-3 text-black" />}
                              </div>
                              <p className="text-sm text-gray-200 leading-relaxed">{r.text}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* RISK ANALYSIS METER */}
                      <div className="glass rounded-3xl p-6 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <Activity className="w-5 h-5 text-purple-400" />
                                <h3 className="font-black tracking-tighter">MULTI-DIMENSIONAL RISK METER</h3>
                            </div>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-purple-500/30 bg-purple-500/10">
                                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
                                <span className="text-[9px] font-black tracking-widest text-purple-400">REAL-TIME</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {data.risk_meter?.map((item: any, i: number) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 transition-all hover:bg-white/10">
                              <div className="flex justify-between items-end mb-2">
                                <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">{item.name}</p>
                                <motion.p 
                                    className="text-xs font-black" style={{ color: item.color }}
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 * i }}
                                >
                                    {item.level}
                                </motion.p>
                              </div>
                              <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden shadow-inner">
                                <motion.div
                                  initial={{ width: 0 }} animate={{ width: `${item.value}%` }}
                                  transition={{ duration: 1.5, delay: 0.2 * i, ease: "easeOut" }}
                                  className="h-full relative"
                                  style={{ background: item.color, boxShadow: `0 0 10px ${item.color}80` }}
                                >
                                   <div className="absolute inset-0 bg-white/20 w-full animate-pulse" />
                                </motion.div>
                              </div>
                              <div className="mt-1.5 text-right">
                                  <span className="text-[8px] text-gray-600 font-mono">{item.value}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Feature Contributions */}
                      <div className="glass rounded-3xl p-6">
                        <div className="flex items-center gap-2 mb-6">
                          <Gauge className="w-5 h-5 text-cyan-400" />
                          <h3 className="font-black tracking-tighter">NEURAL IMPACT FACTORS</h3>
                        </div>
                        <div className="space-y-4">
                          {data.contributions?.map((c: any, i: number) => (
                            <div key={i} className="group">
                              <div className="flex justify-between text-[10px] font-black tracking-widest text-gray-500 mb-1.5 group-hover:text-cyan-400 transition-colors uppercase">
                                <span>{c.label}</span><span>{c.value}% WEIGHT</span>
                              </div>
                              <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }} animate={{ width: `${c.value}%` }}
                                  className={`h-full rounded-full ${c.is_positive ? 'bg-gradient-to-r from-cyan-600 to-cyan-400' : 'bg-gradient-to-r from-red-700 to-red-500'}`}
                                  style={{ boxShadow: c.is_positive ? '0 0 8px rgba(34,211,238,0.4)' : '0 0 8px rgba(239,68,68,0.4)' }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Score Trend — Premium SVG Line Chart */}
                    <div className="md:col-span-12 rounded-3xl p-6 overflow-hidden"
                      style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)' }}
                    >
                      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                        <div className="flex items-center gap-2">
                          <Activity className="w-5 h-5 text-cyan-400" />
                          <h3 className="font-black tracking-tighter text-white">12-MONTH CREDIT TRAJECTORY</h3>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5">
                            <div className="w-6 h-0.5 rounded" style={{ background: 'linear-gradient(90deg,#6366f1,#22d3ee)' }} />
                            <span className="text-[10px] text-gray-500 font-bold">SCORE LINE</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-cyan-400" />
                            <span className="text-[10px] text-gray-500 font-bold">CURRENT: {data.score}</span>
                          </div>
                        </div>
                      </div>

                      {/* SVG Chart */}
                      {(() => {
                        const W = 900, H = 160, PAD = { l: 48, r: 20, t: 16, b: 32 };
                        const innerW = W - PAD.l - PAD.r;
                        const innerH = H - PAD.t - PAD.b;
                        const points = data.trend || [];
                        const scores = points.map((p: any) => p.score);
                        const minS = Math.min(...scores) - 30;
                        const maxS = Math.max(...scores) + 30;
                        const xOf = (i: number) => PAD.l + (i / (points.length - 1)) * innerW;
                        const yOf = (s: number) => PAD.t + innerH - ((s - minS) / (maxS - minS)) * innerH;
                        const pathD = points.map((p: any, i: number) => `${i === 0 ? 'M' : 'L'} ${xOf(i)} ${yOf(p.score)}`).join(' ');
                        const areaD = `${pathD} L ${xOf(points.length - 1)} ${H - PAD.b} L ${PAD.l} ${H - PAD.b} Z`;
                        const gridLines = [minS + (maxS - minS) * 0.25, minS + (maxS - minS) * 0.5, minS + (maxS - minS) * 0.75];

                        return (
                          <div className="relative w-full" style={{ paddingBottom: '20%' }}>
                            <svg
                              viewBox={`0 0 ${W} ${H}`}
                              className="absolute inset-0 w-full h-full"
                              preserveAspectRatio="xMidYMid meet"
                            >
                              <defs>
                                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor="#6366f1" />
                                  <stop offset="100%" stopColor="#22d3ee" />
                                </linearGradient>
                                <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.18" />
                                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                                </linearGradient>
                                <filter id="lineglow">
                                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                                </filter>
                              </defs>

                              {/* Horizontal grid lines */}
                              {gridLines.map((g, i) => (
                                <g key={i}>
                                  <line x1={PAD.l} y1={yOf(g)} x2={W - PAD.r} y2={yOf(g)}
                                    stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 6" />
                                  <text x={PAD.l - 6} y={yOf(g) + 4} textAnchor="end"
                                    fill="rgba(156,163,175,0.5)" fontSize="9" fontFamily="monospace">
                                    {Math.round(g)}
                                  </text>
                                </g>
                              ))}

                              {/* Vertical month lines */}
                              {points.map((_: any, i: number) => (
                                <line key={i} x1={xOf(i)} y1={PAD.t} x2={xOf(i)} y2={H - PAD.b}
                                  stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                              ))}

                              {/* Area fill */}
                              <motion.path d={areaD} fill="url(#areaGrad)"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5, delay: 0.5 }}
                              />

                              {/* Main line */}
                              <motion.path d={pathD} fill="none" stroke="url(#lineGrad)" strokeWidth="2.5"
                                strokeLinecap="round" strokeLinejoin="round" filter="url(#lineglow)"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 2, ease: 'easeOut', delay: 0.3 }}
                              />

                              {/* Dots and labels */}
                              {points.map((p: any, i: number) => {
                                const isLast = i === points.length - 1;
                                return (
                                  <g key={i}>
                                    {/* Month label */}
                                    <text x={xOf(i)} y={H - 6} textAnchor="middle"
                                      fill={isLast ? '#22d3ee' : 'rgba(156,163,175,0.5)'}
                                      fontSize="9" fontFamily="monospace" fontWeight={isLast ? 'bold' : 'normal'}>
                                      {p.month}
                                    </text>
                                    {/* Dot */}
                                    <motion.circle cx={xOf(i)} cy={yOf(p.score)}
                                      r={isLast ? 5 : 3}
                                      fill={isLast ? '#22d3ee' : '#1e293b'}
                                      stroke={isLast ? '#22d3ee' : 'rgba(34,211,238,0.4)'}
                                      strokeWidth={isLast ? 0 : 1.5}
                                      initial={{ scale: 0, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                                      style={isLast ? { filter: 'drop-shadow(0 0 6px #22d3ee)' } : {}}
                                    />
                                    {/* Score tooltip on last point */}
                                    {isLast && (
                                      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.2 }}>
                                        <rect x={xOf(i) - 22} y={yOf(p.score) - 28} width="44" height="18" rx="6"
                                          fill="rgba(34,211,238,0.15)" stroke="rgba(34,211,238,0.3)" strokeWidth="1" />
                                        <text x={xOf(i)} y={yOf(p.score) - 15} textAnchor="middle"
                                          fill="#22d3ee" fontSize="10" fontFamily="monospace" fontWeight="bold">
                                          {p.score}
                                        </text>
                                      </motion.g>
                                    )}
                                  </g>
                                );
                              })}
                            </svg>
                          </div>
                        );
                      })()}
                    </div>

                    {/* ── MONTHLY SCORE BAR TIMELINE ── */}
                    <div className="md:col-span-12 rounded-3xl p-6 overflow-hidden"
                      style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)' }}
                    >
                      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                        <div className="flex items-center gap-2">
                          <BarChart className="w-5 h-5 text-purple-400" />
                          <h3 className="font-black tracking-tighter text-white">MONTHLY SCORE RATIO TIMELINE</h3>
                          <span className="text-[10px] text-gray-600 font-mono ml-2">ANIMATED · LIVE BARS</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{ background: 'linear-gradient(180deg,#818cf8,#6366f1)' }} /><span className="text-[10px] text-gray-500 font-bold">HIGH</span></div>
                          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{ background: 'linear-gradient(180deg,#f59e0b,#d97706)' }} /><span className="text-[10px] text-gray-500 font-bold">MED</span></div>
                          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{ background: 'linear-gradient(180deg,#ef4444,#b91c1c)' }} /><span className="text-[10px] text-gray-500 font-bold">LOW</span></div>
                        </div>
                      </div>

                      <div className="flex items-end gap-2 h-40 w-full">
                        {(data.trend || []).map((t: any, i: number) => {
                          const maxScore = 900, minScore = 300;
                          const pct = Math.max(5, ((t.score - minScore) / (maxScore - minScore)) * 100);
                          const isLast = i === (data.trend?.length || 1) - 1;
                          const isHigh = t.score >= 750;
                          const isMed = t.score >= 600 && t.score < 750;
                          const barGrad = isHigh
                            ? 'linear-gradient(180deg, #a5b4fc 0%, #6366f1 60%, #4338ca 100%)'
                            : isMed
                            ? 'linear-gradient(180deg, #fcd34d 0%, #f59e0b 60%, #d97706 100%)'
                            : 'linear-gradient(180deg, #fca5a5 0%, #ef4444 60%, #b91c1c 100%)';
                          const glowClr = isHigh ? 'rgba(99,102,241,0.7)' : isMed ? 'rgba(245,158,11,0.7)' : 'rgba(239,68,68,0.7)';

                          return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative" style={{ minWidth: 0 }}>
                              {/* Score label on hover */}
                              <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                                <div className="text-[10px] font-black px-2 py-0.5 rounded-lg whitespace-nowrap"
                                  style={{ background: isHigh ? 'rgba(99,102,241,0.9)' : isMed ? 'rgba(245,158,11,0.9)' : 'rgba(239,68,68,0.9)', color: '#fff' }}>
                                  {t.score}
                                </div>
                              </div>

                              {/* Score value above bar */}
                              {isLast && (
                                <motion.div
                                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 1.2 + i * 0.06 }}
                                  className="text-[9px] font-black absolute"
                                  style={{ bottom: `calc(${pct}% + 8px)`, color: '#22d3ee' }}
                                >{t.score}</motion.div>
                              )}

                              {/* Bar */}
                              <div className="w-full relative flex-1 flex items-end">
                                <motion.div
                                  className="w-full rounded-t-lg relative overflow-hidden cursor-pointer"
                                  style={{
                                    height: `${pct}%`,
                                    background: barGrad,
                                    boxShadow: isLast ? `0 -4px 20px ${glowClr}` : 'none',
                                    minHeight: '4px',
                                  }}
                                  initial={{ scaleY: 0, opacity: 0 }}
                                  animate={{ scaleY: 1, opacity: 1 }}
                                  transition={{ delay: 0.1 + i * 0.07, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                                  whileHover={{ scaleY: 1.04, transition: { duration: 0.15 } }}
                                >
                                  {/* Shimmer sweep */}
                                  <motion.div
                                    className="absolute inset-0 w-full"
                                    style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 60%)' }}
                                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                                    transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.15 }}
                                  />
                                  {/* Live pulse on current month */}
                                  {isLast && (
                                    <motion.div
                                      className="absolute inset-0"
                                      style={{ background: 'linear-gradient(180deg, rgba(34,211,238,0.3), transparent)' }}
                                      animate={{ opacity: [0, 0.6, 0] }}
                                      transition={{ duration: 1.5, repeat: Infinity }}
                                    />
                                  )}
                                </motion.div>
                              </div>

                              {/* Month label */}
                              <span className={`text-[8px] font-black tracking-widest mt-1 ${isLast ? 'text-cyan-400' : 'text-gray-700'}`}>
                                {t.month}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Bottom scale */}
                      <div className="mt-4 flex justify-between text-[9px] text-gray-700 font-mono">
                        <span>SCORE 300</span>
                        <span className="text-gray-600">── MONTHLY CREDIT SCORE RATIO ──</span>
                        <span>SCORE 900</span>
                      </div>
                    </div>


                    <div className="md:col-span-12 glass rounded-3xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Server className="w-5 h-5 text-cyan-400" />
                        <h3 className="font-black text-sm tracking-tighter">DATA SIGNALS POWERING THIS SCORE</h3>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {data.signals?.map((s: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 bg-white/3 border border-white/5 px-4 py-2 rounded-full text-xs font-bold text-gray-400">
                            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />{s}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── TAB: REVENUE INTEL ── */}
                {activeTab === 'revenue' && data.revenue_analytics && (
                   <div className="space-y-6">
                      {/* Top Metric Row */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         {[
                            { label: 'EST. ANNUAL REVENUE', val: `₹${(data.revenue_analytics.yearly_revenue/10000000).toFixed(2)} Cr`, sub: 'Projected next 12 months', icon: Activity, color: 'text-cyan-400' },
                            { label: 'AVG MONTHLY INFLOW', val: `₹${(data.revenue_analytics.monthly_avg/100000).toFixed(1)} Lakhs`, sub: 'Verified via UPI proxy', icon: TrendingUp, color: 'text-purple-400' },
                            { label: 'PROJECTED GROWTH', val: `${data.revenue_analytics.financial_kpis.growth_rate_yoy}%`, sub: 'Vs previous calendar year', icon: Zap, color: 'text-green-400' },
                         ].map((m, i) => (
                            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                               className="glass rounded-[2rem] p-6 relative overflow-hidden"
                            >
                               <div className="absolute top-0 right-0 w-24 h-24 blur-3xl rounded-full" style={{ background: i === 0 ? 'rgba(34,211,238,0.05)' : i === 1 ? 'rgba(168,85,247,0.05)' : 'rgba(34,197,94,0.05)' }} />
                               <div className="flex items-center gap-3 mb-4">
                                  <div className={`p-2 rounded-xl bg-white/5 ${m.color}`}><m.icon className="w-4 h-4" /></div>
                                  <span className="text-[10px] font-black tracking-[0.2em] text-gray-500">{m.label}</span>
                               </div>
                               <div className={`text-4xl font-black tracking-tighter mb-1 ${m.color}`}>{m.val}</div>
                               <div className="text-[10px] text-gray-600 font-bold">{m.sub}</div>
                            </motion.div>
                         ))}
                      </div>

                      {/* Revenue Chart Section */}
                      <div className="grid md:grid-cols-3 gap-6">
                         <div className="md:col-span-2 glass rounded-[2rem] p-8 border border-white/5">
                            <div className="flex items-center justify-between mb-8">
                               <div>
                                  <h3 className="text-xl font-black tracking-tighter">MONTHLY REVENUE TRENDS</h3>
                                  <p className="text-xs text-gray-500 font-bold mt-0.5">ESTIMATED CASH FLOW PROXY (INR)</p>
                               </div>
                               <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                  <span className="text-[9px] font-black tracking-widest text-cyan-400">FINANCIAL AI RECONCILIATION</span>
                               </div>
                            </div>
                            
                            {/* DOMINANT SVG AREA + BAR COMPOSITE CHART */}
                            <div className="relative h-72 w-full mt-4">
                               {(() => {
                                  const W = 800, H = 200, PAD = { l: 20, r: 20, t: 30, b: 40 };
                                  const points = data.revenue_analytics.monthly_breakdown;
                                  const maxRev = Math.max(...points.map((x: any) => x.revenue));
                                  const xOf = (i: number) => PAD.l + (i / (points.length - 1)) * (W - PAD.l - PAD.r);
                                  const yOf = (r: number) => PAD.t + (H - PAD.t - PAD.b) - ((r / maxRev) * (H - PAD.t - PAD.b));
                                  
                                  const areaPath = points.map((p: any, i: number) => `${i === 0 ? 'M' : 'L'} ${xOf(i)} ${yOf(p.revenue)}`).join(' ');
                                  const closedArea = `${areaPath} L ${xOf(points.length - 1)} ${H - PAD.b} L ${PAD.l} ${H - PAD.b} Z`;
                                  
                                  return (
                                     <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full drop-shadow-2xl overflow-visible">
                                        <defs>
                                           <linearGradient id="revGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
                                              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                                           </linearGradient>
                                           <linearGradient id="barGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                                              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.2" />
                                           </linearGradient>
                                           <filter id="neon">
                                              <feGaussianBlur stdDeviation="3" result="blur" />
                                              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                                           </filter>
                                        </defs>

                                        {/* Grid lines */}
                                        {[0, 0.5, 1].map((p, i) => (
                                           <line key={i} x1={PAD.l} y1={PAD.t + (H-PAD.t-PAD.b)*p} x2={W-PAD.r} y2={PAD.t + (H-PAD.t-PAD.b)*p} 
                                              stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="4 4" 
                                           />
                                        ))}

                                        {/* Area fill */}
                                        <motion.path 
                                           initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}
                                           d={closedArea} fill="url(#revGrad)" 
                                        />

                                        {/* Line path */}
                                        <motion.path 
                                           initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: "easeInOut" }}
                                           d={areaPath} fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" filter="url(#neon)"
                                        />

                                        {/* Bars overlay (low profile) */}
                                        {points.map((p: any, i: number) => (
                                           <g key={i} className="group cursor-pointer">
                                              <rect x={xOf(i) - 6} y={yOf(p.revenue)} width="12" height={H - PAD.b - yOf(p.revenue)} 
                                                 fill="#22d3ee" fillOpacity="0.1" rx="2" className="transition-all hover:fill-opacity-40" 
                                              />
                                              <circle cx={xOf(i)} cy={yOf(p.revenue)} r="4" fill="#0f172a" stroke="#22d3ee" strokeWidth="2" filter="url(#neon)" />
                                              
                                              {/* Labels */}
                                              <text x={xOf(i)} y={H - 15} textAnchor="middle" fontSize="10" fill="#4b5563" fontWeight="900" className="tracking-tighter">
                                                 {p.month}
                                              </text>

                                              {/* Tooltip on Hover */}
                                              <foreignObject x={xOf(i) - 50} y={yOf(p.revenue) - 55} width="100" height="45" className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                 <div className="bg-black/80 backdrop-blur-md border border-cyan-500/30 rounded-lg p-1.5 text-center shadow-xl">
                                                    <div className="text-[10px] font-black text-cyan-400">₹{(p.revenue/100000).toFixed(1)}L</div>
                                                    <div className="text-[8px] font-bold text-green-400 mt-0.5">↑ {p.growth_mom}% MoM</div>
                                                 </div>
                                              </foreignObject>
                                           </g>
                                        ))}
                                     </svg>
                                  );
                               })()}
                            </div>
                         </div>

                         {/* AI Insights and Health metrics */}
                         <div className="space-y-6">
                            <div className="glass rounded-[2rem] p-6 border border-white/5 h-full">
                               <h4 className="font-black text-xs tracking-widest text-gray-400 mb-5 uppercase flex items-center gap-2">
                                  <Lightbulb className="w-4 h-4 text-amber-400" /> REVENUE INTELLIGENCE
                               </h4>
                               <div className="space-y-4">
                                  {data.revenue_analytics.ai_insights.map((ins: string, i: number) => (
                                     <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
                                        className="flex gap-3 items-start p-3 rounded-2xl bg-white/3 border border-white/5"
                                     >
                                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                                        <p className="text-xs text-gray-300 leading-relaxed italic">"{ins}"</p>
                                     </motion.div>
                                  ))}
                               </div>
                               
                               <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                                  {[
                                     { label: 'Avg Ticket Size', val: `₹${(data.revenue_analytics.financial_kpis.avg_ticket_size).toLocaleString()}` },
                                     { label: 'Operating Margin', val: `${(data.revenue_analytics.financial_kpis.operating_margin * 100).toFixed(0)}%` },
                                     { label: 'Debt-Service Ratio', val: `${data.revenue_analytics.financial_kpis.debt_service_ratio}x` },
                                  ].map((kpi, i) => (
                                     <div key={i} className="flex justify-between items-center bg-black/20 p-3 rounded-xl">
                                        <span className="text-[10px] font-black text-gray-500 tracking-wider uppercase">{kpi.label}</span>
                                        <span className="text-sm font-black text-white">{kpi.val}</span>
                                     </div>
                                  ))}
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                )}

                {/* ── TAB: LOAN ADVISOR ── */}
                {activeTab === 'advisor' && (
                  <div className="space-y-6">
                    <div className="glass rounded-3xl p-6 flex items-center gap-6 flex-wrap">
                      <div className={`px-6 py-3 rounded-2xl text-xs font-black tracking-widest ${data.loanEligibility?.tier === 'PREMIUM' ? 'bg-cyan-500 text-black' : data.loanEligibility?.tier === 'STANDARD' ? 'bg-amber-500 text-black' : 'bg-gray-800 text-white'}`}>
                        {data.loanEligibility?.tier} TIER
                      </div>
                      <p className="text-gray-300 text-sm flex-1">{data.loanEligibility?.message}</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      {data.loanEligibility?.eligible_products?.map((p: any, i: number) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                          className={`glass rounded-3xl p-6 border transition-all ${p.eligible ? 'border-cyan-500/20 hover:border-cyan-500/40' : 'border-gray-800 opacity-50'}`}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="font-black text-lg tracking-tighter">{p.type}</h4>
                            <span className={`text-[10px] font-black px-3 py-1 rounded-full ${p.eligible ? 'bg-green-500/15 text-green-400' : 'bg-gray-800 text-gray-600'}`}>
                              {p.eligible ? 'ELIGIBLE' : 'NOT YET'}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            {[['AMOUNT', p.amount], ['RATE', p.rate], ['TENURE', p.tenure]].map(([l, v]) => (
                              <div key={l}>
                                <div className="text-[9px] text-gray-600 tracking-widest mb-1">{l}</div>
                                <div className="text-sm font-black text-white">{v}</div>
                              </div>
                            ))}
                          </div>
                          {p.eligible && (
                            <button className="mt-4 w-full py-2 rounded-xl bg-cyan-500/10 text-cyan-400 text-xs font-black tracking-wider hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-2">
                              APPLY WITH NBFC PARTNER <ChevronRight className="w-4 h-4" />
                            </button>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── TAB: IMPROVEMENT PLAN ── */}
                {activeTab === 'improve' && (
                  <div className="space-y-4">
                    <div className="glass rounded-3xl p-6 flex items-center gap-4 flex-wrap mb-2">
                      <div className="text-4xl font-black text-cyan-400">{data.score}</div>
                      <div className="flex items-center gap-2 text-gray-400"><ArrowRight className="w-5 h-5" /></div>
                      <div className="text-4xl font-black text-green-400">{Math.min(900, data.score + 80)}</div>
                      <div>
                        <p className="text-xs font-black text-green-400 tracking-wider">+80 PROJECTED</p>
                        <p className="text-[10px] text-gray-500">Following this 6-month plan</p>
                      </div>
                    </div>
                    {data.improvementPlan?.map((step: any, i: number) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                        className="glass rounded-3xl p-6 border border-white/5 hover:border-cyan-500/20 transition-all"
                      >
                        <div className="flex items-start gap-5">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${step.priority === 'critical' ? 'bg-red-500 text-white' : step.priority === 'high' ? 'bg-amber-500 text-black' : 'bg-blue-500 text-white'}`}>
                            {i + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 flex-wrap mb-2">
                              <h4 className="font-black text-lg tracking-tighter">{step.action}</h4>
                              <span className={`text-[10px] px-2 py-0.5 rounded font-black tracking-widest ${step.priority === 'critical' ? 'bg-red-500/15 text-red-400' : step.priority === 'high' ? 'bg-amber-500/15 text-amber-400' : 'bg-blue-500/15 text-blue-400'}`}>
                                {step.priority?.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm mb-3">{step.detail}</p>
                            <div className="flex gap-4">
                              <div><p className="text-[9px] text-gray-600 tracking-widest">SCORE IMPACT</p><p className="text-sm font-black text-green-400">{step.impact}</p></div>
                              <div><p className="text-[9px] text-gray-600 tracking-widest">TIMELINE</p><p className="text-sm font-black text-white">{step.timeline}</p></div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* ── TAB: SECTOR BENCHMARK ── */}
                {activeTab === 'benchmark' && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="glass rounded-3xl p-8">
                      <h3 className="font-black text-xl tracking-tighter mb-6">YOUR SECTOR POSITION</h3>
                      <div className="flex items-end gap-6 mb-8">
                        <div><p className="text-[10px] text-gray-500 tracking-widest mb-1">YOUR PERCENTILE</p><p className="text-6xl font-black text-cyan-400">P{data.benchmark?.percentile}</p></div>
                        <div className="text-right flex-1"><p className="text-lg font-black text-white">{data.benchmark?.peer_position}</p><p className="text-xs text-gray-500">{data.benchmark?.businesses_analyzed?.toLocaleString()} businesses analyzed</p></div>
                      </div>
                      <div className="space-y-3">
                        {[
                          { label: 'Your Score', val: data.score, color: 'bg-cyan-500' },
                          { label: 'Sector Avg', val: data.benchmark?.sector_avg_score, color: 'bg-gray-600' },
                          { label: 'Top Quartile', val: data.benchmark?.top_quartile_score, color: 'bg-green-500' },
                        ].map(row => (
                          <div key={row.label}>
                            <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1 tracking-widest uppercase"><span>{row.label}</span><span>{row.val}</span></div>
                            <div className="h-1.5 bg-gray-900 rounded-full"><div className={`h-full rounded-full ${row.color}`} style={{ width: `${((row.val - 300) / 600) * 100}%` }} /></div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="glass rounded-3xl p-8">
                      <h3 className="font-black text-xl tracking-tighter mb-6">SECTOR INTELLIGENCE</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: 'Sector', val: data.benchmark?.sector || data.details?.sector },
                          { label: 'Risk Profile', val: data.benchmark?.sector_risk_profile },
                          { label: 'Default Rate', val: data.benchmark?.sector_default_rate },
                          { label: 'Growth Rate', val: data.benchmark?.sector_growth_rate },
                          { label: 'Typical Loan', val: data.benchmark?.typical_loan_size },
                          { label: 'Points vs Avg', val: `${data.benchmark?.points_vs_avg > 0 ? '+' : ''}${data.benchmark?.points_vs_avg}` },
                        ].map(row => (
                          <div key={row.label} className="bg-white/2 border border-white/5 rounded-xl p-4">
                            <p className="text-[9px] text-gray-600 tracking-widest mb-1">{row.label}</p>
                            <p className="font-black text-white text-sm">{row.val || 'N/A'}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── TAB: RISK SIGNALS ── */}
                {activeTab === 'fraud' && (
                  <div className="space-y-6">
                    <div className={`glass rounded-3xl p-8 border-l-4 ${data.fraud?.flag === 'CLEAR' ? 'border-l-green-500' : 'border-l-red-500'}`}>
                      <div className="flex items-center gap-4 mb-6">
                        {data.fraud?.flag === 'CLEAR'
                          ? <CheckCircle className="w-10 h-10 text-green-500" />
                          : <AlertTriangle className="w-10 h-10 text-red-500" />
                        }
                        <div>
                          <h3 className="text-2xl font-black tracking-tighter">{data.fraud?.flag === 'CLEAR' ? 'FRAUD CLEARANCE: PASS' : 'FRAUD ALERT DETECTED'}</h3>
                          <p className="text-sm text-gray-400 mt-1">Graph-based network analysis using NetworkX engine</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { label: 'Fraud Probability', val: `${(data.fraud?.fraud_probability * 100).toFixed(1)}%`, bad: data.fraud?.fraud_probability > 0.3 },
                          { label: 'Circular Trading', val: data.fraud?.circular_trading_detected ? 'DETECTED' : 'NONE', bad: data.fraud?.circular_trading_detected },
                          { label: 'Network Centrality', val: data.fraud?.network_centrality, bad: data.fraud?.network_centrality > 0.3 },
                          { label: 'Overall Flag', val: data.fraud?.flag, bad: data.fraud?.flag !== 'CLEAR' },
                        ].map(row => (
                          <div key={row.label} className="bg-white/3 border border-white/5 rounded-2xl p-4">
                            <p className="text-[9px] text-gray-600 tracking-widest mb-2">{row.label}</p>
                            <p className={`text-xl font-black ${row.bad ? 'text-red-400' : 'text-green-400'}`}>{row.val}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {data.anomalies?.length > 0 && (
                      <div className="glass rounded-3xl p-6">
                        <h3 className="font-black mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-400" /> ANOMALY ALERTS</h3>
                        {data.anomalies.map((a: any, i: number) => (
                          <div key={i} className={`p-4 rounded-2xl border mb-3 ${a.severity === 'HIGH' ? 'bg-red-500/5 border-red-500/20' : 'bg-amber-500/5 border-amber-500/20'}`}>
                            <div className="flex justify-between items-start mb-1">
                              <p className="font-black text-sm">{a.title}</p>
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded ${a.severity === 'HIGH' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>{a.severity}</span>
                            </div>
                            <p className="text-xs text-gray-400">{a.detail}</p>
                            <p className="text-[10px] text-gray-600 mt-1">Detected: {a.detected_on}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {data.anomalies?.length === 0 && (
                      <div className="glass rounded-3xl p-8 text-center">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                        <h3 className="font-black text-xl text-green-400">NO ANOMALIES DETECTED</h3>
                        <p className="text-gray-500 text-sm mt-2">All financial patterns are within normal operating ranges.</p>
                      </div>
                    )}
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

          {/* AI Chatbot */}
          <Chatbot scoreData={data} />
        </motion.div>
      )}

      </AnimatePresence>
    </div>
  );
}
