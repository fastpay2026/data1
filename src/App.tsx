import React, { useState, useEffect } from 'react';
import { 
  Wallet, Send, History, CheckCircle2, AlertCircle, Clock, ArrowUpRight,
  Building2, User, CreditCard, LogOut, LayoutDashboard, Shield, Briefcase, 
  Calculator, Menu, X, Activity, Lock, Users, Plus, Terminal, ShieldCheck, Globe,
  Trash2, Zap, Satellite, Landmark, DollarSign, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { supabase } from './lib/supabase';

// --- Types ---
type Role = 'manager' | 'employee' | 'accountant';
type View = 'overview' | 'transfer' | 'history' | 'users';
type TransactionStatus = 'pending' | 'completed' | 'failed';

interface UserAccount {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: Role;
  balance: number;
  isUnlimited?: boolean;
  maxStoredTransfers?: number;
  storedTransfersCount?: number;
  ibanCooldownMinutes?: number;
}

interface Transaction {
  id: string;
  date: string;
  recipientName: string;
  iban: string;
  amount: number;
  status: TransactionStatus;
  createdBy: string;
  server?: string;
}

// --- Constants ---
const IBAN_SHORTCUTS: Record<string, string> = {
  '1': 'NL28INGB4492703411',
  '2': 'TG65259839229539759299235173',
  '3': 'PK66FZYW1614974124948885',
  '4': 'LB06943151658758328885851489',
  '5': 'IR0073982001IRKHM19',
  '6': 'AZ89MUAD91587132136941878378',
  '7': 'IR293671363912182346221147',
  '8': 'IQ16988012004902002',
};

// --- Components ---
function BackgroundSystem() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Moving Grid */}
      <div className="absolute inset-0 live-grid opacity-[0.2] animate-grid-flow"></div>
      
      {/* Volumetric Light Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] volumetric-light opacity-30 animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] volumetric-light opacity-20 animate-float" style={{ animationDelay: '-7s' }}></div>
      
      {/* Drifting Orbs with Depth */}
      <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full animate-float" style={{ animationDelay: '-12s' }}></div>
      <div className="absolute bottom-[20%] left-[15%] w-[35%] h-[35%] bg-emerald-500/5 blur-[100px] rounded-full animate-float" style={{ animationDelay: '-18s' }}></div>
      
      {/* Floating Data Particles */}
      {[...Array(15)].map((_, i) => (
        <div 
          key={i}
          className="absolute w-1 h-1 bg-indigo-400/20 rounded-full animate-particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${100 + Math.random() * 20}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${15 + Math.random() * 10}s`
          }}
        />
      ))}
      
      {/* Scanline Effect */}
      <div className="scanline animate-scan opacity-30"></div>
      
      {/* Technical Data Stream (Subtle) */}
      <div className="absolute top-0 right-10 bottom-0 w-px bg-indigo-500/10 hidden lg:block"></div>
      <div className="absolute top-0 left-10 bottom-0 w-px bg-indigo-500/10 hidden lg:block"></div>
    </div>
  );
}

function SystemLog() {
  const [logs, setLogs] = useState<string[]>([]);
  
  useEffect(() => {
    const events = [
      "ENCRYPTED_SESSION_ESTABLISHED",
      "NODE_SYNC_COMPLETE",
      "QUANTUM_HANDSHAKE_VERIFIED",
      "AES_256_KEY_ROTATED",
      "NETWORK_LATENCY_OPTIMIZED",
      "BLOCK_VERIFICATION_SUCCESS",
      "FIREWALL_HEARTBEAT_OK",
      "DB_INTEGRITY_CHECK_PASSED",
      "SERVER_GERMANY_ACTIVE",
      "SERVER_USA_ACTIVE",
      "SERVER_ISRAEL_ACTIVE",
      "SERVER_UKRAINE_ACTIVE",
      "SERVER_BRITAIN_ACTIVE",
      "SERVER_FRANCE_ACTIVE",
      "SERVER_GULF_ACTIVE",
      "SERVER_PENTAGON_ACTIVE",
      "SERVER_NATO_ACTIVE"
    ];
    
    const interval = setInterval(() => {
      const newLog = `[${new Date().toLocaleTimeString()}] ${events[Math.floor(Math.random() * events.length)]}`;
      setLogs(prev => [newLog, ...prev].slice(0, 5));
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-2 opacity-40">
      {logs.map((log, i) => (
        <p key={i} className="technical-label text-[7px] lowercase tracking-tighter truncate">
          {log}
        </p>
      ))}
    </div>
  );
}

// --- Animation Component ---
function NatoSecurityEvent({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'warning' | 'satellite' | 'resolution'>('warning');
  const [warningTime, setWarningTime] = useState(30);

  useEffect(() => {
    // Start siren sound using Web Audio API
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
    
    // Siren effect: oscillate frequency
    const sirenInterval = setInterval(() => {
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.5);
      oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 1.0);
    }, 1000);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
    oscillator.start();

    // Warning Phase Timer
    const timer = setInterval(() => {
      setWarningTime(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          clearInterval(sirenInterval);
          oscillator.stop();
          audioCtx.close();
          setPhase('satellite');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(sirenInterval);
      try {
        oscillator.stop();
        audioCtx.close();
      } catch (e) {}
    };
  }, []);

  useEffect(() => {
    if (phase === 'satellite') {
      const timer = setTimeout(() => {
        setPhase('resolution');
      }, 15000);
      return () => clearTimeout(timer);
    } else if (phase === 'resolution') {
      const timer = setTimeout(() => {
        onComplete();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center text-white overflow-hidden">
      <AnimatePresence mode="wait">
        {phase === 'warning' && (
          <motion.div 
            key="warning"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="text-center space-y-8 p-12 border-8 border-red-600 bg-red-600/5 rounded-[4rem] animate-pulse relative"
          >
            <div className="absolute inset-0 bg-red-600/10 blur-3xl rounded-full"></div>
            <AlertTriangle size={140} className="text-red-600 mx-auto relative z-10" />
            <h1 className="text-7xl font-black text-red-600 tracking-tighter relative z-10">WARRING WARRING WARRING</h1>
            <p className="text-4xl font-bold text-white max-w-3xl leading-relaxed relative z-10" dir="rtl">
              هنالك محاولة الى تعقب عملية التحويل التي جرت منذ قليل
            </p>
            <div className="text-5xl font-mono font-black text-red-500 relative z-10">
              SECURE_LOCKDOWN_IN: {warningTime}s
            </div>
          </motion.div>
        )}

        {phase === 'satellite' && (
          <motion.div 
            key="satellite"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative w-full h-full flex items-center justify-center bg-slate-950"
          >
             <div className="absolute inset-0 opacity-30">
               <img 
                 src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2072&auto=format&fit=crop" 
                 className="w-full h-full object-cover" 
                 referrerPolicy="no-referrer"
               />
             </div>

             <svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 1000 600">
                {/* Satellite 1 */}
                <motion.g initial={{ x: 150, y: 150 }} animate={{ y: [150, 160, 150] }} transition={{ duration: 4, repeat: Infinity }}>
                  <circle cx="0" cy="0" r="15" fill="#00f2ff" />
                  <rect x="-30" y="-4" width="60" height="8" fill="#00f2ff" opacity="0.6" />
                  <text x="0" y="35" fill="#00f2ff" fontSize="10" textAnchor="middle" className="font-mono">NATO_SAT_01</text>
                </motion.g>

                {/* Satellite 2 (Sky) */}
                <motion.g initial={{ x: 500, y: 80 }} animate={{ y: [80, 90, 80] }} transition={{ duration: 5, repeat: Infinity }}>
                  <circle cx="0" cy="0" r="15" fill="#00f2ff" />
                  <rect x="-30" y="-4" width="60" height="8" fill="#00f2ff" opacity="0.6" />
                  <text x="0" y="35" fill="#00f2ff" fontSize="10" textAnchor="middle" className="font-mono">RELAY_SAT_SKY</text>
                </motion.g>

                {/* Satellite 3 (Israel) */}
                <motion.g initial={{ x: 800, y: 350 }} animate={{ y: [350, 360, 350] }} transition={{ duration: 6, repeat: Infinity }}>
                  <circle cx="0" cy="0" r="15" fill="#00f2ff" />
                  <rect x="-30" y="-4" width="60" height="8" fill="#00f2ff" opacity="0.6" />
                  <text x="0" y="35" fill="#00f2ff" fontSize="10" textAnchor="middle" className="font-mono">ISR_SAT_NODE</text>
                </motion.g>

                {/* Beams */}
                <motion.line 
                  x1="150" y1="150" x2="500" y2="80" 
                  stroke="#00f2ff" strokeWidth="2" strokeDasharray="8,4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 3, delay: 1 }}
                />
                <motion.line 
                  x1="500" y1="80" x2="800" y2="350" 
                  stroke="#00f2ff" strokeWidth="2" strokeDasharray="8,4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 3, delay: 5 }}
                />

                {/* Internet Source Attempt */}
                <motion.g initial={{ x: 500, y: 480 }} opacity={0} animate={{ opacity: 1 }} transition={{ delay: 9 }}>
                  <rect x="-60" y="-35" width="120" height="70" fill="none" stroke="#ff0000" strokeWidth="2" />
                  <text x="0" y="0" fill="#ff0000" fontSize="12" textAnchor="middle" className="font-mono font-bold">INT_GATEWAY_SRC</text>
                </motion.g>

                <motion.line 
                  x1="800" y1="350" x2="500" y2="480" 
                  stroke="#ff0000" strokeWidth="4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: [0, 1, 0] }}
                  transition={{ duration: 2, delay: 10, repeat: 2 }}
                />

                {/* Failure Message */}
                <motion.text 
                  x="500" y="550" fill="#ff0000" fontSize="28" fontWeight="900" textAnchor="middle"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.2, 1, 0] }}
                  transition={{ duration: 4, delay: 12 }}
                >
                  ACCESS_DENIED: CONNECTION_FAILED
                </motion.text>
             </svg>

             <div className="absolute bottom-20 text-center space-y-4">
               <p className="text-cyan-400 font-mono text-lg animate-pulse tracking-widest">RE-ROUTING VIA QUANTUM MESH...</p>
               <p className="text-red-500 font-mono text-sm font-bold">COUNTER_TRACE_ACTIVE / BLOCKING_UPLINK</p>
             </div>
          </motion.div>
        )}

        {phase === 'resolution' && (
          <motion.div 
            key="resolution"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-10"
          >
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-40 h-40 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.3)]"
            >
              <ShieldCheck size={80} className="text-emerald-500" />
            </motion.div>
            <div className="space-y-4">
              <h1 className="text-6xl font-black text-emerald-500 tracking-tighter" dir="rtl">تم احباط عملية التعقب</h1>
              <p className="text-3xl font-bold text-slate-300" dir="rtl">ان النظام في امان الآن</p>
            </div>
            <div className="w-80 h-2 bg-slate-800 rounded-full mx-auto overflow-hidden border border-slate-700">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 10, ease: "linear" }}
                className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Animation Component ---
function TransferAnimation({ onComplete, server }: { onComplete: () => void, server: string }) {
  const [step, setStep] = useState(0);
  const duration = 60000; // 60 seconds exactly

  // Currency symbols positions (relative %)
  const currencies = [
    { symbol: '$', x: '20%', y: '30%', delay: 2 },
    { symbol: '€', x: '45%', y: '35%', delay: 5 },
    { symbol: '$', x: '75%', y: '25%', delay: 8 },
    { symbol: '€', x: '30%', y: '60%', delay: 11 },
    { symbol: '$', x: '60%', y: '70%', delay: 14 },
    { symbol: '€', x: '85%', y: '65%', delay: 17 },
    { symbol: '$', x: '50%', y: '20%', delay: 20 },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#00f2ff', '#0066ff', '#ffffff']
      });
    }, duration);

    const stepInterval = setInterval(() => {
      setStep(prev => (prev < 100 ? prev + 1 : 100));
    }, duration / 100);

    return () => {
      clearTimeout(timer);
      clearInterval(stepInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center overflow-hidden">
      {/* Background Animated Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#e0f2fe_0%,_transparent_50%),radial-gradient(circle_at_bottom_left,_#fef3c7_0%,_transparent_50%)] opacity-40"></div>
      
      <div className="relative w-full max-w-5xl aspect-video flex items-center justify-center p-8">
        {/* World Map Background - High Quality */}
        <div className="absolute inset-0 opacity-5">
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" 
            alt="World Map" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* SVG Overlay for Neon Effects */}
        <svg className="absolute inset-0 w-full h-full z-20" viewBox="0 0 1000 600">
          <defs>
            <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="1" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Sequential Currency Glow */}
          {currencies.map((c, i) => (
            <motion.g
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: step > (c.delay / 60 * 100) ? 1 : 0,
                scale: step > (c.delay / 60 * 100) ? [1, 1.3, 1] : 0,
              }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
            >
              <text
                x={c.x}
                y={c.y}
                fill="#4f46e5"
                fontSize="48"
                fontWeight="900"
                filter="url(#neonGlow)"
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-mono"
              >
                {c.symbol}
              </text>
            </motion.g>
          ))}

          {/* Connection Lines - Dynamic */}
          {step > 10 && (
            <motion.path
              d="M200,300 C350,100 650,500 800,300"
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="3"
              strokeDasharray="10,10"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 40, ease: "easeInOut" }}
            />
          )}
        </svg>

        {/* Central Status UI */}
        <div className="relative z-30 flex flex-col items-center">
          <motion.div 
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 1, -1, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-48 h-48 bg-white rounded-[3rem] shadow-2xl shadow-indigo-200 flex items-center justify-center border border-indigo-50 mb-10 relative"
          >
            <div className="absolute inset-0 bg-indigo-600 rounded-[3rem] opacity-5 animate-pulse"></div>
            <Globe className="text-indigo-600" size={80} />
            
            {/* Progress Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="8"
              />
              <motion.circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="#4f46e5"
                strokeWidth="8"
                strokeDasharray="552.92"
                animate={{ strokeDashoffset: 552.92 * (1 - step / 100) }}
                transition={{ duration: 0.5 }}
                strokeLinecap="round"
              />
            </svg>
          </motion.div>

          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">جاري تشفير ومعالجة الحوالة</h2>
            <div className="flex items-center justify-center gap-3">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    className="w-2 h-2 bg-indigo-600 rounded-full"
                  />
                ))}
              </div>
              <span className="text-indigo-600 font-mono font-black text-xl">{step}%</span>
            </div>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-[0.3em]">
              Secure Quantum Tunnel Established via {server}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="absolute bottom-12 left-0 right-0 px-12 flex justify-between items-end">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Origin Node</p>
          <p className="text-sm font-bold text-slate-600">AES-256-GCM / TLS 1.3</p>
        </div>
        <div className="text-right space-y-1">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Network Status</p>
          <p className="text-sm font-bold text-emerald-500 flex items-center gap-2 justify-end">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            OPTIMIZED
          </p>
        </div>
      </div>
    </div>
  );
}

const isStoredIban = (iban: string) => Object.values(IBAN_SHORTCUTS).includes(iban);

// --- Helper Functions ---
const generateId = () => Math.random().toString(36).substr(2, 9).toUpperCase();

const formatCurrency = (amount: number, isUnlimited?: boolean) => {
  if (amount === Infinity || isUnlimited) return '∞ USD';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(new Date(dateString));
};

const getRoleLabel = (role: Role) => {
  switch (role) {
    case 'manager': return 'مدير النظام';
    case 'employee': return 'موظف تحويلات';
    case 'accountant': return 'محاسب مالي';
  }
};

const getRoleIcon = (role: Role) => {
  switch (role) {
    case 'manager': return <Shield size={18} />;
    case 'employee': return <Briefcase size={18} />;
    case 'accountant': return <Calculator size={18} />;
  }
};

// --- Components ---

function LoginScreen({ onLoginAttempt }: { onLoginAttempt: (u: string, p: string) => string | null }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setError(null);
    
    setTimeout(() => {
      const err = onLoginAttempt(username, password);
      if (err) {
        setError(err);
        setIsAuthenticating(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900 relative overflow-hidden">
      <BackgroundSystem />
      
      {/* Technical Overlays */}
      <div className="absolute top-10 left-10 technical-label opacity-20 hidden md:block">
        SYSTEM_STATUS: ACTIVE<br />
        ENCRYPTION: AES_256<br />
        NODE: 0x7F2A
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-dark p-10 rounded-[3rem] shadow-2xl border border-white/10 relative overflow-hidden group">
          {/* Animated Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 blur-[80px] rounded-full group-hover:bg-indigo-500/30 transition-colors duration-700"></div>
          
          <div className="flex flex-col items-center mb-10">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-500/40 mb-8 relative"
            >
              <ShieldCheck size={48} className="text-white relative z-10" />
              <div className="absolute inset-0 bg-white/20 rounded-[2rem] animate-pulse-soft"></div>
            </motion.div>
            <h1 className="text-4xl font-black text-white tracking-tight mb-2">بوابة الوصول</h1>
            <p className="technical-label text-indigo-300/60">Secure Financial Protocol v4.2</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="technical-label text-slate-400 mr-2">معرف الوصول</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-500">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white/10 transition-all text-white font-bold placeholder:text-slate-600"
                  placeholder="أدخل المعرف"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="technical-label text-slate-400 mr-2">مفتاح التشفير</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-500">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white/10 transition-all text-white font-bold placeholder:text-slate-600"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm font-bold"
                >
                  <AlertCircle size={18} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-2xl shadow-indigo-500/30 transition-all active:scale-[0.98] font-black text-lg flex items-center justify-center gap-3 disabled:opacity-50 group"
            >
              {isAuthenticating ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  بدء المصادقة
                  <ArrowUpRight size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-10 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
            <div className="flex items-center gap-4 opacity-30">
              <Satellite size={16} className="text-indigo-400" />
              <div className="w-px h-4 bg-white/20"></div>
              <Activity size={16} className="text-emerald-400" />
              <div className="w-px h-4 bg-white/20"></div>
              <Lock size={16} className="text-amber-400" />
            </div>
            <p className="technical-label text-[7px] text-slate-500">Quantum-Resistant Encryption Active</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function App() {
  // --- State ---
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  
  const [currentView, setCurrentView] = useState<View>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Forms State
  const [transferData, setTransferData] = useState({ recipientName: '', iban: '', amount: '', server: 'المانيا' });
  const [newUserData, setNewUserData] = useState({ name: '', username: '', password: '', role: 'employee' as Role, balance: '', isUnlimited: false, maxStoredTransfers: '10', ibanCooldownMinutes: '240' });
  
  // Transfer Progress State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [showNatoEvent, setShowNatoEvent] = useState(false);
  const [transferProgress, setTransferProgress] = useState(0);
  const [transferMessage, setTransferMessage] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const secureMessages = [
    `جاري إنشاء نفق اتصال مشفر (AES-256) عبر سيرفر ${transferData.server}...`,
    "جاري إخفاء الهوية وتوجيه الاتصال عبر خوادم آمنة...",
    "جاري تجاوز عقد التتبع والتحقق من سلامة القناة...",
    "تشفير بيانات المستفيد والمبلغ المالي...",
    `جاري تنفيذ الحوالة عبر عقدة ${transferData.server} بسرعة فائقة...`,
    "مسح آثار الاتصال وتأكيد العملية بنجاح..."
  ];

  // --- Initial Data Fetching ---
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // Fetch Users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*');
      
      if (usersError) {
        console.error('Supabase Users Error:', usersError);
        setNotification({ type: 'error', message: `فشل جلب المستخدمين: ${usersError.message}` });
      } else {
        if (usersData && usersData.length > 0) {
          // Map manager balance to Infinity for frontend logic
          const mappedUsers = usersData.map((u: any) => ({
            ...u,
            balance: (u.role === 'manager' || u.is_unlimited) ? Infinity : u.balance,
            isUnlimited: u.is_unlimited,
            maxStoredTransfers: u.max_stored_transfers || 10,
            storedTransfersCount: u.stored_transfers_count || 0,
            ibanCooldownMinutes: u.iban_cooldown_minutes || 240
          }));
          setUsers(mappedUsers);
          
          // Update currentUser if already logged in (e.g. on refresh)
          if (currentUser) {
            const updatedMe = mappedUsers.find(u => u.id === currentUser.id);
            if (updatedMe) setCurrentUser(updatedMe);
          }
        } else {
          // If DB is empty, try to seed the initial admin
          const initialAdmin = { id: 'u_admin', username: 'admin', password: 'admin', name: 'المدير العام', role: 'manager', balance: 999999999, is_unlimited: true };
          const { error: seedError } = await supabase.from('users').insert([initialAdmin]);
          if (!seedError) setUsers([{ ...initialAdmin, balance: Infinity, isUnlimited: true }]);
        }
      }

      // Fetch Transactions
      const { data: txData, error: txError } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });
      
      if (txError) {
        console.error('Supabase TX Error:', txError);
      } else if (txData) {
        const formattedTx: Transaction[] = txData.map(tx => ({
          id: tx.id,
          date: tx.date,
          recipientName: tx.recipient_name,
          iban: tx.iban,
          amount: tx.amount,
          status: tx.status,
          createdBy: tx.created_by,
          server: tx.server
        }));
        setTransactions(formattedTx);
      }
    } catch (error: any) {
      console.error('Connection Error:', error);
      setNotification({ type: 'error', message: 'تعذر الاتصال بقاعدة البيانات. تأكد من إعدادات Vercel.' });
    }
  };

  // --- Derived Data ---
  const totalTransferred = transactions.filter(tx => tx.createdBy === currentUser?.username).reduce((sum, tx) => sum + tx.amount, 0);
  const totalTransactions = transactions.filter(tx => tx.createdBy === currentUser?.username).length;
  const recentTransactions = transactions.slice(0, 5);

  // --- Handlers ---
  const handleLoginAttempt = (u: string, p: string) => {
    const found = users.find(user => user.username === u && user.password === p);
    if (found) {
      setCurrentUser(found);
      setCurrentView(found.role === 'employee' ? 'transfer' : 'overview');
      return null;
    }
    return 'بيانات الاعتماد غير صالحة. تم تسجيل محاولة الدخول.';
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsSidebarOpen(false);
  };

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setNotification(null);

    if (!transferData.recipientName.trim() || !transferData.iban.trim() || !transferData.amount) {
      setNotification({ type: 'error', message: 'يرجى تعبئة جميع الحقول المطلوبة.' });
      return;
    }
    if (!/^[A-Z]{2}[0-9A-Z]+$/.test(transferData.iban) || transferData.iban.length < 15) {
      setNotification({ type: 'error', message: 'صيغة الآيبان غير مطابقة للمعايير.' });
      return;
    }
    
    const amountNum = parseFloat(transferData.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setNotification({ type: 'error', message: 'قيمة المبلغ غير صالحة.' });
      return;
    }

    // Check for dynamic cooldown for employees
    if (currentUser!.role === 'employee') {
      const cooldownMs = (currentUser!.ibanCooldownMinutes || 240) * 60 * 1000;
      const cooldownAgo = new Date(Date.now() - cooldownMs).toISOString();
      const recentTx = transactions.find(tx => 
        tx.iban === transferData.iban && 
        tx.createdBy === currentUser!.username && 
        tx.date > cooldownAgo
      );
      if (recentTx) {
        const cooldownHours = (currentUser!.ibanCooldownMinutes || 240) / 60;
        const msg = cooldownHours < 1 
          ? `لا يمكن التحويل لنفس الآيبان إلا مرة واحدة كل ${currentUser!.ibanCooldownMinutes} دقيقة.`
          : `لا يمكن التحويل لنفس الآيبان إلا مرة واحدة كل ${cooldownHours} ساعة.`;
        setNotification({ type: 'error', message: msg });
        return;
      }
    }

    if (currentUser!.role !== 'manager' && !currentUser!.isUnlimited && amountNum > currentUser!.balance) {
      setNotification({ type: 'error', message: 'الرصيد المتاح غير كافٍ لتنفيذ العملية.' });
      return;
    }

    // Check stored IBAN limit
    if (currentUser!.role === 'employee' && isStoredIban(transferData.iban)) {
      const currentCount = currentUser!.storedTransfersCount || 0;
      const maxLimit = currentUser!.maxStoredTransfers || 0;
      if (currentCount >= maxLimit) {
        setNotification({ type: 'error', message: `لقد وصلت للحد الأقصى المسموح به للتحويل للأرقام المخزنة (${maxLimit} تحويلات).` });
        return;
      }
    }

    setIsSubmitting(true);
    setShowAnimation(true);
  };

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    if (transferData.server === 'حلف الناتو') {
      setShowNatoEvent(true);
    } else {
      finalizeTransfer();
    }
  };

  const handleNatoEventComplete = () => {
    setShowNatoEvent(false);
    finalizeTransfer();
  };

  const finalizeTransfer = () => {
    const amountNum = parseFloat(transferData.amount);
    const txId = `TX-${generateId()}`;
    const newTransaction: Transaction = {
      id: txId,
      date: new Date().toISOString(),
      recipientName: transferData.recipientName,
      iban: transferData.iban,
      amount: amountNum,
      status: 'completed',
      createdBy: currentUser!.username,
      server: transferData.server
    };

    // Sync with Supabase
    const performSync = async () => {
      try {
        // Insert Transaction
        const { error: txError } = await supabase
          .from('transactions')
          .insert([{
            id: txId,
            date: newTransaction.date,
            recipient_name: newTransaction.recipientName,
            iban: newTransaction.iban,
            amount: newTransaction.amount,
            status: newTransaction.status,
            created_by: newTransaction.createdBy,
            server: newTransaction.server
          }]);
        
        if (txError) throw txError;

        // Update balances
        if (currentUser!.role !== 'manager' && !currentUser!.isUnlimited) {
          const newBalance = currentUser!.balance - amountNum;
          const isStored = isStoredIban(transferData.iban);
          const newCount = isStored ? (currentUser!.storedTransfersCount || 0) + 1 : (currentUser!.storedTransfersCount || 0);

          const { error: userError } = await supabase
            .from('users')
            .update({ 
              balance: newBalance,
              stored_transfers_count: newCount
            })
            .eq('id', currentUser!.id);
          
          if (userError) throw userError;

          setUsers(prev => prev.map(u => u.id === currentUser!.id ? { ...u, balance: newBalance, storedTransfersCount: newCount } : u));
          setCurrentUser(prev => prev ? { ...prev, balance: newBalance, storedTransfersCount: newCount } : null);
        } else if (isStoredIban(transferData.iban)) {
          const newCount = (currentUser!.storedTransfersCount || 0) + 1;
          await supabase.from('users').update({ stored_transfers_count: newCount }).eq('id', currentUser!.id);
          setUsers(prev => prev.map(u => u.id === currentUser!.id ? { ...u, storedTransfersCount: newCount } : u));
          setCurrentUser(prev => prev ? { ...prev, storedTransfersCount: newCount } : null);
        }
        
        setTransactions(prev => [newTransaction, ...prev]);
        setTransferData({ recipientName: '', iban: '', amount: '', server: 'المانيا' });
        setIsSubmitting(false);
        setNotification({ type: 'success', message: 'تم تنفيذ الحوالة بنجاح وبسرية تامة.' });
      } catch (error: any) {
        console.error('Sync error:', error);
        setIsSubmitting(false);
        setNotification({ 
          type: 'error', 
          message: `خطأ في المزامنة: ${error.message || 'تأكد من إعدادات RLS والمتغيرات البيئية'}` 
        });
      }
    };

    performSync();
    setTimeout(() => setNotification(null), 8000);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    if (!newUserData.name || !newUserData.username || !newUserData.password || (!newUserData.isUnlimited && !newUserData.balance)) {
      setNotification({ type: 'error', message: 'يرجى تعبئة جميع الحقول.' });
      return;
    }

    if (users.some(u => u.username === newUserData.username)) {
      setNotification({ type: 'error', message: 'معرف المستخدم محجوز مسبقاً.' });
      return;
    }

    const allocatedBalance = newUserData.isUnlimited ? 999999999 : parseFloat(newUserData.balance);
    if (!newUserData.isUnlimited && (isNaN(allocatedBalance) || allocatedBalance < 0)) {
      setNotification({ type: 'error', message: 'قيمة الرصيد غير صالحة.' });
      return;
    }

    if (currentUser!.role !== 'manager' && !currentUser!.isUnlimited && allocatedBalance > currentUser!.balance) {
      setNotification({ type: 'error', message: 'الرصيد المتاح لا يغطي التخصيص المطلوب.' });
      return;
    }

    const createdUser: UserAccount = {
      id: `U-${generateId()}`,
      name: newUserData.name,
      username: newUserData.username,
      password: newUserData.password,
      role: newUserData.role,
      balance: newUserData.isUnlimited ? Infinity : allocatedBalance,
      isUnlimited: newUserData.isUnlimited,
      maxStoredTransfers: parseInt(newUserData.maxStoredTransfers) || 10,
      storedTransfersCount: 0,
      ibanCooldownMinutes: parseInt(newUserData.ibanCooldownMinutes) || 240
    };

    const syncUser = async () => {
      try {
        // Insert new user
        const { error: insertError } = await supabase
          .from('users')
          .insert([{
            id: createdUser.id,
            name: createdUser.name,
            username: createdUser.username,
            password: createdUser.password,
            role: createdUser.role,
            balance: newUserData.isUnlimited ? 999999999 : allocatedBalance,
            is_unlimited: createdUser.isUnlimited,
            max_stored_transfers: createdUser.maxStoredTransfers,
            stored_transfers_count: 0,
            iban_cooldown_minutes: createdUser.ibanCooldownMinutes
          }]);
        
        if (insertError) throw insertError;

        // Deduct from manager, add new user
        if (currentUser!.role !== 'manager' && !currentUser!.isUnlimited) {
          const newManagerBalance = currentUser!.balance - allocatedBalance;
          const { error: updateError } = await supabase
            .from('users')
            .update({ balance: newManagerBalance })
            .eq('id', currentUser!.id);
          
          if (updateError) throw updateError;

          setUsers(prev => {
            const updated = prev.map(u => u.id === currentUser!.id ? { ...u, balance: newManagerBalance } : u);
            return [...updated, createdUser];
          });
          setCurrentUser(prev => prev ? { ...prev, balance: newManagerBalance } : null);
        } else {
          setUsers(prev => [...prev, createdUser]);
        }

        setNewUserData({ name: '', username: '', password: '', role: 'employee', balance: '', isUnlimited: false });
        setNotification({ type: 'success', message: 'تم إنشاء الحساب وتخصيص الرصيد بنجاح.' });
      } catch (error: any) {
        console.error('User sync error:', error);
        setNotification({ 
          type: 'error', 
          message: `خطأ في حفظ المستخدم: ${error.message || 'تأكد من صلاحيات الجدول (RLS)'}` 
        });
      }
    };

    syncUser();
    setTimeout(() => setNotification(null), 5000);
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === currentUser?.id) {
      setNotification({ type: 'error', message: 'لا يمكنك حذف حسابك الحالي.' });
      return;
    }

    if (!window.confirm('هل أنت متأكد من رغبتك في حذف هذا المستخدم نهائياً؟')) return;

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);
      
      if (error) throw error;

      setUsers(prev => prev.filter(u => u.id !== userId));
      setNotification({ type: 'success', message: 'تم حذف المستخدم بنجاح.' });
    } catch (error: any) {
      setNotification({ type: 'error', message: `فشل الحذف: ${error.message}` });
    }
  };

  const handleRechargeUser = async (userId: string, amount: number, isUnlimited: boolean, maxStored?: number, cooldownMinutes?: number) => {
    try {
      const updateData: any = { 
        balance: isUnlimited ? 999999999 : amount,
        is_unlimited: isUnlimited
      };
      if (maxStored !== undefined) {
        updateData.max_stored_transfers = maxStored;
        updateData.stored_transfers_count = 0; // Reset count on recharge/update if manager wants
      }
      if (cooldownMinutes !== undefined) {
        updateData.iban_cooldown_minutes = cooldownMinutes;
      }

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId);
      
      if (error) throw error;

      setUsers(prev => prev.map(u => u.id === userId ? { 
        ...u, 
        balance: isUnlimited ? Infinity : amount,
        isUnlimited: isUnlimited,
        maxStoredTransfers: maxStored !== undefined ? maxStored : u.maxStoredTransfers,
        storedTransfersCount: maxStored !== undefined ? 0 : u.storedTransfersCount,
        ibanCooldownMinutes: cooldownMinutes !== undefined ? cooldownMinutes : u.ibanCooldownMinutes
      } : u));
      setNotification({ type: 'success', message: 'تم تحديث بيانات المستخدم بنجاح.' });
    } catch (error: any) {
      setNotification({ type: 'error', message: `فشل التحديث: ${error.message}` });
    }
  };

  // --- Render logic ---
  if (!currentUser) {
    return <LoginScreen onLoginAttempt={handleLoginAttempt} />;
  }

  const navItems = [
    { id: 'overview', label: 'لوحة التحكم', icon: LayoutDashboard, roles: ['manager', 'accountant'] },
    { id: 'transfer', label: 'تحويل آمن', icon: Send, roles: ['manager', 'employee'] },
    { id: 'users', label: 'إدارة الصلاحيات', icon: Users, roles: ['manager'] },
    { id: 'history', label: 'سجل العمليات', icon: History, roles: ['manager', 'employee', 'accountant'] },
  ].filter(item => item.roles.includes(currentUser.role));

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return (
          <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-5xl font-black text-slate-900 tracking-tight">مرحباً، {currentUser.name}</h2>
                <p className="text-slate-500 font-medium mt-3 text-xl">إليك ملخص نشاطك المالي المشفر لليوم</p>
              </div>
              <div className="flex items-center gap-5 glass p-4 rounded-3xl shadow-xl border border-white/40">
                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                  <Clock size={28} />
                </div>
                <div className="text-left">
                  <p className="technical-label leading-none mb-1 text-indigo-600">Session Active</p>
                  <p className="text-base font-black text-slate-900">Online Now</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Main Balance Card */}
              <div className="md:col-span-8 bento-card p-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/5 rounded-full -mr-40 -mt-40 transition-transform group-hover:scale-125 duration-1000"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-500/5 rounded-full -ml-20 -mb-20 transition-transform group-hover:scale-150 duration-1000"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-12">
                    <div className="p-5 bg-indigo-600 rounded-3xl text-white shadow-2xl shadow-indigo-500/30 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                      <Wallet size={40} />
                    </div>
                    <div className="text-right">
                      <span className="technical-label text-indigo-600">Vault Balance</span>
                      <div className="flex items-center gap-3 text-[10px] font-black text-emerald-600 bg-emerald-50 px-5 py-2 rounded-full mt-3 border border-emerald-100 shadow-sm">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        SECURE_NODE_01
                      </div>
                    </div>
                  </div>
                  <div className="text-7xl font-mono font-black text-slate-900 tracking-tighter mb-6 drop-shadow-sm" dir="ltr">
                    {formatCurrency(currentUser.balance, currentUser.isUnlimited)}
                  </div>
                  <p className="text-slate-500 font-bold text-lg">إجمالي الرصيد المتاح للتحويل الفوري</p>
                </div>
              </div>
              
              {/* Side Stats */}
              <div className="md:col-span-4 flex flex-col gap-6">
                <div className="flex-1 bento-card p-8 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                      <Activity size={24} />
                    </div>
                    <span className="technical-label">Volume</span>
                  </div>
                  <div>
                    <p className="text-3xl font-mono font-black text-slate-900 tracking-tight" dir="ltr">{formatCurrency(totalTransferred)}</p>
                    <p className="text-xs font-bold text-slate-400 mt-2">إجمالي حجم التداول</p>
                  </div>
                </div>
                
                <div className="flex-1 bento-card p-8 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
                      <History size={24} />
                    </div>
                    <span className="technical-label">Operations</span>
                  </div>
                  <div>
                    <p className="text-3xl font-mono font-black text-slate-900 tracking-tight">{totalTransactions}</p>
                    <p className="text-xs font-bold text-slate-400 mt-2">عملية تحويل مكتملة</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Transactions Section */}
            <div className="bento-card overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-indigo-600">
                    <Terminal size={20} />
                  </div>
                  أحدث العمليات المشفرة
                </h3>
                <button 
                  onClick={() => setCurrentView('history')} 
                  className="text-xs font-black text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-xl transition-all border border-indigo-100"
                >
                  عرض السجل الكامل
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                      <th className="px-10 py-5">المستفيد</th>
                      <th className="px-10 py-5">السيرفر</th>
                      <th className="px-10 py-5">المبلغ</th>
                      <th className="px-10 py-5">التاريخ</th>
                      <th className="px-10 py-5">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-10 py-20 text-center text-slate-400 font-bold italic">لا توجد عمليات حديثة في الشبكة</td>
                      </tr>
                    ) : (
                      recentTransactions.map(tx => (
                        <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-10 py-6">
                            <p className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{tx.recipientName}</p>
                            <p className="text-[10px] font-mono font-bold text-slate-400 mt-1" dir="ltr">{tx.iban}</p>
                          </td>
                          <td className="px-10 py-6">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                              {tx.server || 'Default'}
                            </span>
                          </td>
                          <td className="px-10 py-6 font-mono font-black text-slate-900" dir="ltr">
                            {formatCurrency(tx.amount)}
                          </td>
                          <td className="px-10 py-6">
                            <p className="text-xs font-bold text-slate-600">{formatDate(tx.date)}</p>
                          </td>
                          <td className="px-10 py-6">
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-widest">
                              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                              Verified
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'transfer':
        return (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="bento-card p-10 sm:p-16 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2.5 bg-indigo-600"></div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-10 mb-16">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-indigo-600 shadow-inner border border-indigo-100/50">
                    <Send size={36} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">تحويل آمن ومشفّر</h2>
                    <p className="text-slate-500 font-medium mt-1 text-lg">نظام التحويل الفوري العالمي v4.0</p>
                  </div>
                </div>
                <div className="bg-slate-50/80 backdrop-blur-sm px-8 py-6 rounded-[2rem] border border-slate-100 text-center shadow-sm">
                  <p className="technical-label mb-2">Available Vault Funds</p>
                  <p className="text-3xl font-mono font-black text-indigo-600 tracking-tighter" dir="ltr">
                    {formatCurrency(currentUser.balance, currentUser.isUnlimited)}
                  </p>
                </div>
              </div>

              {notification && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-8 rounded-[2rem] mb-12 flex items-start gap-6 border-2 ${
                    notification.type === 'success' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                      : 'bg-red-50 text-red-700 border-red-100'
                  }`}
                >
                  <div className={`p-3 rounded-2xl ${notification.type === 'success' ? 'bg-emerald-100 shadow-lg shadow-emerald-100' : 'bg-red-100 shadow-lg shadow-red-100'}`}>
                    {notification.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                  </div>
                  <div>
                    <p className="text-lg font-black leading-tight mb-1">
                      {notification.type === 'success' ? 'تمت العملية بنجاح' : 'خطأ في النظام'}
                    </p>
                    <p className="text-sm font-bold opacity-80 leading-relaxed">{notification.message}</p>
                  </div>
                </motion.div>
              )}

              {isSubmitting ? (
                <div className="py-12 space-y-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-4 h-4 bg-indigo-600 rounded-full animate-ping"></div>
                      <span className="text-indigo-600 font-black text-2xl">{transferMessage}</span>
                    </div>
                    <span className="text-slate-400 font-mono font-black text-xl">{Math.round(transferProgress)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-6 overflow-hidden border border-slate-200 p-1.5">
                    <motion.div 
                      className="bg-indigo-600 h-full rounded-full shadow-lg shadow-indigo-200 relative"
                      style={{ width: `${transferProgress}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_1.5s_infinite]"></div>
                    </motion.div>
                  </div>
                  <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 font-mono text-sm text-slate-500 space-y-4 shadow-inner">
                    <p className="flex items-center gap-3"><span className="text-indigo-400">●</span> INITIALIZING SECURE PROTOCOL...</p>
                    <p className="flex items-center gap-3"><span className="text-indigo-400">●</span> BYPASSING REGIONAL RESTRICTIONS...</p>
                    {transferProgress > 30 && <p className="flex items-center gap-3 text-indigo-600/70 font-bold"><span className="text-indigo-600">●</span> CONNECTION ANONYMIZED.</p>}
                    {transferProgress > 60 && <p className="flex items-center gap-3 text-indigo-600/70 font-bold"><span className="text-indigo-600">●</span> PAYLOAD ENCRYPTED.</p>}
                    {transferProgress > 90 && <p className="flex items-center gap-3 text-indigo-600/70 font-bold"><span className="text-indigo-600">●</span> EXECUTING TRANSFER...</p>}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleTransferSubmit} className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="technical-label mr-2">اسم المستفيد</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                          <User size={22} />
                        </div>
                        <input
                          type="text"
                          required
                          value={transferData.recipientName}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTransferData(prev => {
                              const newData = { ...prev, recipientName: val };
                              if (IBAN_SHORTCUTS[val]) {
                                newData.iban = IBAN_SHORTCUTS[val];
                              }
                              return newData;
                            });
                          }}
                          className="block w-full pr-14 pl-5 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all text-slate-900 font-bold text-lg placeholder:text-slate-300"
                          placeholder="الاسم الكامل للمستفيد"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="technical-label mr-2">رقم الآيبان (IBAN)</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                          <CreditCard size={22} />
                        </div>
                        <input
                          type="text"
                          required
                          value={transferData.iban}
                          onChange={(e) => setTransferData(prev => ({ ...prev, iban: e.target.value.toUpperCase().replace(/\s/g, '') }))}
                          className="block w-full pr-14 pl-5 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all text-slate-900 font-black font-mono text-lg placeholder:text-slate-300"
                          placeholder="SA00 0000 0000..."
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="technical-label mr-2">سيرفر التحويل</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                        <Globe size={22} />
                      </div>
                      <select
                        required
                        value={transferData.server}
                        onChange={(e) => setTransferData(prev => ({ ...prev, server: e.target.value }))}
                        className="block w-full pr-14 pl-5 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all text-slate-900 font-bold text-lg appearance-none cursor-pointer"
                      >
                        <option value="المانيا">المانيا</option>
                        <option value="اميركا">اميركا</option>
                        <option value="اسرائيل">اسرائيل</option>
                        <option value="اوكرانيا">اوكرانيا</option>
                        <option value="بريطانيا">بريطانيا</option>
                        <option value="فرنسا">فرنسا</option>
                        <option value="دول الخليج">دول الخليج</option>
                        <option value="البنتاغون">البنتاغون</option>
                        <option value="حلف الناتو">حلف الناتو</option>
                      </select>
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400">
                        <ArrowUpRight size={18} className="rotate-90" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="technical-label mr-2">مبلغ التحويل (USD)</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                        <DollarSign size={32} />
                      </div>
                      <input
                        type="number"
                        required
                        min="1"
                        step="0.01"
                        value={transferData.amount}
                        onChange={(e) => setTransferData(prev => ({ ...prev, amount: e.target.value }))}
                        className="block w-full pr-16 pl-6 py-8 bg-slate-50 border border-slate-100 rounded-[2rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all text-slate-900 font-black font-mono text-5xl placeholder:text-slate-200"
                        placeholder="0.00"
                        dir="ltr"
                      />
                    </div>
                    <div className="flex justify-between px-4">
                      <p className="text-xs font-bold text-slate-400">الحد الأدنى للتحويل: $1.00</p>
                      <p className="text-xs font-bold text-slate-400">رسوم التحويل: $0.00 (مغطاة)</p>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex justify-center items-center gap-4 py-6 px-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] shadow-2xl shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale font-black text-2xl group"
                    >
                      {isSubmitting ? (
                        <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          تأكيد وإرسال الحوالة الآن
                          <ArrowUpRight size={32} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </button>
                    <div className="flex items-center justify-center gap-4 mt-8 opacity-40 grayscale">
                      <Shield size={16} />
                      <p className="technical-label">AES-256 Encrypted • Quantum Secure • ISO 20022</p>
                      <Globe size={16} />
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">إدارة الصلاحيات</h2>
                <p className="text-slate-500 font-medium mt-2 text-lg">التحكم في وصول الموظفين وتخصيص الأرصدة المشفرة</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Add User Form */}
              <div className="lg:col-span-4">
                <div className="bento-card p-10 sticky top-10">
                  <h3 className="text-xl font-black text-slate-900 mb-10 flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 shadow-sm">
                      <Plus size={24} />
                    </div>
                    إصدار تصريح جديد
                  </h3>

                  {notification && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-6 rounded-2xl mb-10 flex items-start gap-4 border-2 text-sm ${
                        notification.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
                      }`}
                    >
                      {notification.type === 'success' ? <CheckCircle2 className="shrink-0" size={20} /> : <AlertCircle className="shrink-0" size={20} />}
                      <p className="font-bold leading-relaxed">{notification.message}</p>
                    </motion.div>
                  )}

                  <form onSubmit={handleAddUser} className="space-y-8">
                    <div className="space-y-3">
                      <label className="technical-label mr-2">الاسم الكامل</label>
                      <input
                        type="text"
                        required
                        value={newUserData.name}
                        onChange={(e) => setNewUserData(prev => ({ ...prev, name: e.target.value }))}
                        className="block w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all text-slate-900 font-bold placeholder:text-slate-300"
                        placeholder="أدخل الاسم الثلاثي"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="technical-label mr-2">معرف المستخدم</label>
                      <input
                        type="text"
                        required
                        value={newUserData.username}
                        onChange={(e) => setNewUserData(prev => ({ ...prev, username: e.target.value }))}
                        className="block w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all text-slate-900 font-bold font-mono placeholder:text-slate-300"
                        dir="ltr"
                        placeholder="username"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="technical-label mr-2">مفتاح التشفير (كلمة المرور)</label>
                      <input
                        type="text"
                        required
                        value={newUserData.password}
                        onChange={(e) => setNewUserData(prev => ({ ...prev, password: e.target.value }))}
                        className="block w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all text-slate-900 font-bold font-mono placeholder:text-slate-300"
                        dir="ltr"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="technical-label mr-2">حد التحويلات</label>
                        <input
                          type="number"
                          required
                          value={newUserData.maxStoredTransfers}
                          onChange={(e) => setNewUserData(prev => ({ ...prev, maxStoredTransfers: e.target.value }))}
                          className="block w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 font-black font-mono"
                          dir="ltr"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="technical-label mr-2">مدة الانتظار (د)</label>
                        <input
                          type="number"
                          required
                          value={newUserData.ibanCooldownMinutes}
                          onChange={(e) => setNewUserData(prev => ({ ...prev, ibanCooldownMinutes: e.target.value }))}
                          className="block w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 font-black font-mono"
                          dir="ltr"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="technical-label mr-2">مستوى الصلاحية</label>
                      <select
                        value={newUserData.role}
                        onChange={(e) => setNewUserData(prev => ({ ...prev, role: e.target.value as Role }))}
                        className="block w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 font-bold appearance-none"
                      >
                        <option value="employee">موظف تحويلات</option>
                        <option value="manager">مدير نظام</option>
                        <option value="accountant">محاسب مالي</option>
                      </select>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="technical-label mr-2">الرصيد المخصص (USD)</label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <span className="text-[10px] font-black text-slate-400 group-hover:text-indigo-600 transition-colors uppercase tracking-widest">إنفينيتي</span>
                          <div className={`w-12 h-6 rounded-full transition-all relative ${newUserData.isUnlimited ? 'bg-indigo-600 shadow-lg shadow-indigo-100' : 'bg-slate-200'}`}>
                            <input 
                              type="checkbox" 
                              className="sr-only" 
                              checked={newUserData.isUnlimited}
                              onChange={(e) => setNewUserData(prev => ({ ...prev, isUnlimited: e.target.checked }))}
                            />
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${newUserData.isUnlimited ? 'left-7' : 'left-1'}`}></div>
                          </div>
                        </label>
                      </div>
                      <input
                        type="number"
                        value={newUserData.balance}
                        disabled={newUserData.isUnlimited}
                        onChange={(e) => setNewUserData(prev => ({ ...prev, balance: e.target.value }))}
                        min="0"
                        className="block w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 font-black font-mono text-2xl disabled:opacity-30 disabled:grayscale"
                        dir="ltr"
                        placeholder="0.00"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full flex justify-center items-center gap-4 py-5 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-2xl shadow-indigo-100 transition-all active:scale-[0.98] font-black text-xl"
                    >
                      <Plus size={24} />
                      تأكيد وإصدار التصريح
                    </button>
                  </form>
                </div>
              </div>

              {/* Users List */}
              <div className="lg:col-span-8">
                <div className="bento-card overflow-hidden">
                  <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-indigo-600">
                        <Users size={20} />
                      </div>
                      سجل التصاريح النشطة
                    </h3>
                    <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-4 py-2 rounded-full border border-indigo-100 uppercase tracking-widest">
                      TOTAL: {users.length}
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-right">
                      <thead>
                        <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                          <th className="px-10 py-5">الهوية</th>
                          <th className="px-10 py-5">المستوى</th>
                          <th className="px-10 py-5">التحويلات</th>
                          <th className="px-10 py-5">الرصيد (USD)</th>
                          <th className="px-10 py-5">إجراءات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {users.map(u => (
                          <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-10 py-6">
                              <p className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{u.name}</p>
                              <p className="text-[10px] font-mono font-bold text-slate-400 mt-1" dir="ltr">@{u.username}</p>
                            </td>
                            <td className="px-10 py-6">
                              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black bg-slate-50 text-slate-600 border border-slate-100 uppercase tracking-widest">
                                {getRoleIcon(u.role)} {u.role}
                              </span>
                            </td>
                            <td className="px-10 py-6">
                              <div className="flex flex-col gap-2">
                                <span className={`text-[10px] font-black font-mono ${u.storedTransfersCount! >= u.maxStoredTransfers! ? 'text-red-500' : 'text-indigo-600'}`}>
                                  {u.storedTransfersCount} / {u.maxStoredTransfers}
                                </span>
                                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, (u.storedTransfersCount! / u.maxStoredTransfers!) * 100)}%` }}
                                    className={`h-full transition-all ${u.storedTransfersCount! >= u.maxStoredTransfers! ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.4)]'}`}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="px-10 py-6 font-mono font-black text-slate-900" dir="ltr">
                              {formatCurrency(u.balance, u.isUnlimited)}
                            </td>
                            <td className="px-10 py-6">
                              <div className="flex items-center gap-3">
                                <button 
                                  onClick={() => {
                                    const amountStr = prompt('أدخل المبلغ الجديد أو "inf" للرصيد اللانهائي:', u.isUnlimited ? 'inf' : u.balance.toString());
                                    if (amountStr !== null) {
                                      const limitStr = prompt('أدخل الحد الجديد للتحويلات المخزنة (أو اترك فارغاً لعدم التغيير):', u.maxStoredTransfers?.toString());
                                      const cooldownStr = prompt('أدخل مدة الانتظار الجديدة بالدقائق (أو اترك فارغاً لعدم التغيير):', u.ibanCooldownMinutes?.toString());
                                      
                                      let finalBalance = u.balance;
                                      let finalIsUnlimited = u.isUnlimited;
                                      let finalMaxStored = u.maxStoredTransfers;
                                      let finalCooldown = u.ibanCooldownMinutes;

                                      if (amountStr.toLowerCase() === 'inf') {
                                        finalIsUnlimited = true;
                                        finalBalance = 999999999;
                                      } else {
                                        const num = parseFloat(amountStr);
                                        if (!isNaN(num)) {
                                          finalBalance = num;
                                          finalIsUnlimited = false;
                                        }
                                      }

                                      if (limitStr !== null && limitStr !== '') {
                                        const limitNum = parseInt(limitStr);
                                        if (!isNaN(limitNum)) finalMaxStored = limitNum;
                                      }

                                      if (cooldownStr !== null && cooldownStr !== '') {
                                        const cooldownNum = parseInt(cooldownStr);
                                        if (!isNaN(cooldownNum)) finalCooldown = cooldownNum;
                                      }

                                      handleRechargeUser(u.id, finalBalance, !!finalIsUnlimited, finalMaxStored, finalCooldown);
                                    }
                                  }}
                                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all active:scale-90"
                                  title="تعديل البيانات والشحن"
                                >
                                  <Zap size={18} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteUser(u.id)}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                                  title="حذف المستخدم"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">سجل العمليات</h2>
                <p className="text-slate-500 font-medium mt-2 text-lg">مراقبة وتتبع كافة التحويلات المالية المشفرة</p>
              </div>
            </div>

            <div className="bento-card overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-indigo-600">
                    <History size={20} />
                  </div>
                  سجل العمليات المشفرة
                </h3>
                <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-4 py-2 rounded-full border border-indigo-100 uppercase tracking-widest">
                  RECORDS: {transactions.length}
                </span>
              </div>
              
              {transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 text-slate-400 font-bold italic">
                  <Terminal size={64} className="mb-8 opacity-10" />
                  <p className="text-xl">لا توجد سجلات متاحة حالياً</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead>
                      <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                        <th className="px-10 py-5">المرجع (TX_ID)</th>
                        <th className="px-10 py-5">المستفيد</th>
                        <th className="px-10 py-5">السيرفر</th>
                        <th className="px-10 py-5">المبلغ</th>
                        <th className="px-10 py-5">التاريخ (UTC)</th>
                        <th className="px-10 py-5">المصدر</th>
                        <th className="px-10 py-5">الحالة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {transactions.map(tx => (
                        <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-10 py-6">
                            <span className="text-[10px] font-mono font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-xl uppercase tracking-wider">{tx.id}</span>
                          </td>
                          <td className="px-10 py-6">
                            <p className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{tx.recipientName}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-1" dir="ltr">{tx.iban}</p>
                          </td>
                          <td className="px-10 py-6">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                              {tx.server || 'Default'}
                            </span>
                          </td>
                          <td className="px-10 py-6">
                            <span className="font-mono font-black text-slate-900" dir="ltr">{formatCurrency(tx.amount)}</span>
                          </td>
                          <td className="px-10 py-6 text-xs font-bold text-slate-500" dir="ltr">{formatDate(tx.date)}</td>
                          <td className="px-10 py-6">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                              {tx.createdBy}
                            </span>
                          </td>
                          <td className="px-10 py-6">
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm shadow-emerald-50">
                              <CheckCircle2 size={14} /> SECURE_OK
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-transparent text-slate-900 font-sans flex overflow-hidden selection:bg-indigo-500/30 relative">
      <BackgroundSystem />
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/20 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 right-0 z-50 w-80 glass border-l border-slate-100/50 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col shadow-2xl lg:shadow-none
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 lg:static lg:block
      `}>
        <div className="h-24 flex items-center justify-between px-10 border-b border-slate-100/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-[1rem] flex items-center justify-center shadow-2xl shadow-indigo-200 rotate-3 group hover:rotate-0 transition-transform duration-500">
              <ShieldCheck size={28} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-2xl tracking-tight text-slate-900 leading-none">نظام التحويل</span>
              <span className="technical-label text-[8px] mt-1">v4.2.0-STABLE</span>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-3 text-slate-400 hover:text-indigo-600 transition-colors">
            <X size={28} />
          </button>
        </div>

        <div className="p-8">
          <div className="flex items-center gap-5 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-inner">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-indigo-600 font-mono font-black text-2xl shadow-sm border border-slate-100">
              {currentUser.username.substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-slate-900 font-black text-base truncate">{currentUser.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                  {getRoleIcon(currentUser.role)}
                </div>
                <span className="technical-label text-[10px] uppercase tracking-widest">{currentUser.role}</span>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id as View);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-bold text-sm group ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-50">
          <div className="mb-6 px-4">
            <SystemLog />
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold text-sm group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            إنهاء الجلسة
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-transparent">
        {/* Top Header */}
        <header className="glass h-24 flex items-center justify-between px-6 sm:px-12 shrink-0 z-10 sticky top-0 border-b border-slate-100/50">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-4 text-slate-400 hover:bg-slate-100 rounded-2xl transition-all"
            >
              <Menu size={28} />
            </button>
            <div className="hidden sm:block">
              <div className="flex items-center gap-4">
                <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
                <div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">
                    {navItems.find(i => i.id === currentView)?.label}
                  </h1>
                  <p className="technical-label text-[9px] mt-0.5 opacity-50">SECURE_SESSION_ACTIVE</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-10">
            <div className="hidden xl:flex items-center gap-5 px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="technical-label text-[10px]">System Online</span>
              </div>
              <div className="w-px h-4 bg-slate-200"></div>
              <div className="flex items-center gap-2">
                <Globe size={12} className="text-indigo-500" />
                <span className="technical-label text-[10px] text-indigo-600">Active Server: {transferData.server}</span>
              </div>
              <div className="w-px h-4 bg-slate-200"></div>
              <span className="font-mono text-[10px] text-slate-400 font-bold" dir="ltr">NODE_ID: 157-AFG</span>
            </div>
            
            <div className="flex flex-col items-end">
              <span className="technical-label text-[9px] mb-1 opacity-60">Available Balance</span>
              <span className="text-2xl sm:text-3xl font-mono font-black text-indigo-600 tracking-tighter leading-none" dir="ltr">
                {formatCurrency(currentUser.balance, currentUser.isUnlimited)}
              </span>
            </div>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 custom-scrollbar perspective-1000">
          <motion.div 
            initial={{ opacity: 0, rotateX: 5, y: 20 }}
            animate={{ opacity: 1, rotateX: 0, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-6xl mx-auto relative z-10"
          >
            {renderView()}
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showAnimation && (
          <TransferAnimation onComplete={handleAnimationComplete} server={transferData.server} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNatoEvent && (
          <NatoSecurityEvent onComplete={handleNatoEventComplete} />
        )}
      </AnimatePresence>
    </div>
  );
}
