import React, { useState, useEffect } from 'react';
import { 
  Wallet, Send, History, CheckCircle2, AlertCircle, Clock, ArrowUpRight,
  Building2, User, CreditCard, LogOut, LayoutDashboard, Shield, Briefcase, 
  Calculator, Menu, X, Activity, Lock, Users, Plus, Terminal, ShieldCheck, Globe,
  Trash2, Zap, Satellite, Landmark
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
}

interface Transaction {
  id: string;
  date: string;
  recipientName: string;
  iban: string;
  amount: number;
  status: TransactionStatus;
  createdBy: string;
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
};

// --- Animation Component ---
function TransferAnimation({ onComplete }: { onComplete: () => void }) {
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
    <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#003366_0%,_transparent_70%)] opacity-30"></div>
      
      <div className="relative w-full max-w-5xl aspect-video flex items-center justify-center p-8">
        {/* World Map Background (The image provided by user) */}
        <div className="absolute inset-0 opacity-40 mix-blend-screen">
          <img 
            src="https://images.unsplash.com/photo-1589519160732-57fc498494f8?q=80&w=2070&auto=format&fit=crop" 
            alt="World Map" 
            className="w-full h-full object-contain filter brightness-50 contrast-125"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* SVG Overlay for Neon Effects */}
        <svg className="absolute inset-0 w-full h-full z-20" viewBox="0 0 1000 600">
          <defs>
            <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="strongGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="10" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Sequential Currency Glow */}
          {currencies.map((c, i) => (
            <motion.g
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: step > (c.delay / 60 * 100) ? 1 : 0,
                scale: step > (c.delay / 60 * 100) ? [1, 1.2, 1] : 0,
              }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
            >
              <text
                x={c.x}
                y={c.y}
                fill="#00f2ff"
                fontSize="40"
                fontWeight="bold"
                filter="url(#neonGlow)"
                className="font-mono"
              >
                {c.symbol}
              </text>
            </motion.g>
          ))}

          {/* Map Contours Lighting Up (Gradual) */}
          <motion.path
            d="M150,200 L250,150 L400,180 L550,150 L750,180 L850,250 L800,450 L600,500 L400,480 L200,450 Z" // Simplified world path
            fill="none"
            stroke="#00f2ff"
            strokeWidth="2"
            filter="url(#strongGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: step > 40 ? (step - 40) / 60 : 0,
              opacity: step > 40 ? 0.8 : 0 
            }}
            transition={{ duration: 0.5 }}
          />

          {/* Connection Lines */}
          {step > 20 && (
            <motion.path
              d="M200,300 Q500,100 800,300"
              fill="none"
              stroke="#0066ff"
              strokeWidth="1"
              strokeDasharray="10,10"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 30, ease: "linear" }}
            />
          )}
        </svg>

        {/* Central Status */}
        <div className="relative z-30 text-center space-y-8">
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              textShadow: ["0 0 10px #00f2ff", "0 0 30px #00f2ff", "0 0 10px #00f2ff"]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl font-black text-white tracking-widest uppercase"
          >
            جاري المزامنة العالمية
          </motion.div>
          
          <div className="flex flex-col items-center gap-4">
            <div className="w-96 h-1.5 bg-[#111] rounded-full overflow-hidden border border-[#222] relative">
              <motion.div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#0066ff] to-[#00f2ff] shadow-[0_0_15px_#00f2ff]"
                style={{ width: `${step}%` }}
              />
            </div>
            <div className="text-emerald-500 font-mono text-xl">
              {step}% <span className="text-slate-500 ml-2">| SECURE_CHANNEL_ACTIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-12 w-full max-w-4xl px-8 grid grid-cols-3 gap-8 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
        <div className="space-y-2 border-l border-[#222] pl-4">
          <p className="text-white">Protocol: AES-XTS-512</p>
          <p>Status: Encrypting Payload</p>
        </div>
        <div className="space-y-2 border-l border-[#222] pl-4">
          <p className="text-white">Relay: Satellite-V4</p>
          <p>Location: Global Grid</p>
        </div>
        <div className="space-y-2">
          <p className="text-white">Time: {Math.max(0, 60 - Math.floor(step * 0.6))}s Remaining</p>
          <p>Verification: Pending</p>
        </div>
      </div>
    </div>
  );
}

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
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const err = onLoginAttempt(username, password);
    if (err) setError(err);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#050505] flex items-center justify-center p-4 font-sans text-slate-300">
      <div className="bg-[#0f0f11] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-[#222]">
        <div className="p-8 text-center border-b border-[#222] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
          <div className="w-16 h-16 bg-[#1a1a1f] border border-[#333] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <ShieldCheck size={32} className="text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">بوابة العبور الآمنة</h1>
          <p className="text-slate-500 mt-2 text-sm font-mono tracking-widest uppercase">SECURE SYSTEM LOGIN</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 flex items-start gap-3">
                <AlertCircle className="shrink-0 mt-0.5" size={18} />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-bold text-slate-400 mb-2">
                معرف المستخدم
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-600">
                  <Terminal size={18} />
                </div>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pr-10 pl-3 py-3 border border-[#333] rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-[#141418] text-white transition-colors font-mono"
                  placeholder="admin"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-slate-400 mb-2">
                مفتاح التشفير (كلمة المرور)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-600">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pr-10 pl-3 py-3 border border-[#333] rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-[#141418] text-white transition-colors font-mono"
                  placeholder="••••••••"
                  dir="ltr"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-emerald-500/50 rounded-lg shadow-lg text-sm font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500 hover:text-[#050505] focus:outline-none transition-all active:scale-[0.98]"
            >
              <Lock size={18} />
              توثيق الدخول
            </button>
          </form>
        </div>
      </div>
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
  const [transferData, setTransferData] = useState({ recipientName: '', iban: '', amount: '' });
  const [newUserData, setNewUserData] = useState({ name: '', username: '', password: '', role: 'employee' as Role, balance: '', isUnlimited: false });
  
  // Transfer Progress State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [transferProgress, setTransferProgress] = useState(0);
  const [transferMessage, setTransferMessage] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const secureMessages = [
    "جاري إنشاء نفق اتصال مشفر (AES-256)...",
    "جاري إخفاء الهوية وتوجيه الاتصال عبر خوادم آمنة...",
    "جاري تجاوز عقد التتبع والتحقق من سلامة القناة...",
    "تشفير بيانات المستفيد والمبلغ المالي...",
    "جاري تنفيذ الحوالة بسرعة فائقة وبدون تعقب...",
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
            isUnlimited: u.is_unlimited
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
          createdBy: tx.created_by
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

    // Check for 4-hour cooldown for employees
    if (currentUser!.role === 'employee') {
      const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString();
      const recentTx = transactions.find(tx => 
        tx.iban === transferData.iban && 
        tx.createdBy === currentUser!.username && 
        tx.date > fourHoursAgo
      );
      if (recentTx) {
        setNotification({ type: 'error', message: 'لا يمكن التحويل لنفس الآيبان إلا مرة واحدة كل 4 ساعات.' });
        return;
      }
    }

    if (currentUser!.role !== 'manager' && !currentUser!.isUnlimited && amountNum > currentUser!.balance) {
      setNotification({ type: 'error', message: 'الرصيد المتاح غير كافٍ لتنفيذ العملية.' });
      return;
    }

    setIsSubmitting(true);
    setShowAnimation(true);
  };

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    const amountNum = parseFloat(transferData.amount);
    const txId = `TX-${generateId()}`;
    const newTransaction: Transaction = {
      id: txId,
      date: new Date().toISOString(),
      recipientName: transferData.recipientName,
      iban: transferData.iban,
      amount: amountNum,
      status: 'completed',
      createdBy: currentUser!.username
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
            created_by: newTransaction.createdBy
          }]);
        
        if (txError) throw txError;

        // Update balances
        if (currentUser!.role !== 'manager' && !currentUser!.isUnlimited) {
          const newBalance = currentUser!.balance - amountNum;
          const { error: userError } = await supabase
            .from('users')
            .update({ balance: newBalance })
            .eq('id', currentUser!.id);
          
          if (userError) throw userError;

          setUsers(prev => prev.map(u => u.id === currentUser!.id ? { ...u, balance: newBalance } : u));
          setCurrentUser(prev => prev ? { ...prev, balance: newBalance } : null);
        }
        
        setTransactions(prev => [newTransaction, ...prev]);
        setTransferData({ recipientName: '', iban: '', amount: '' });
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
      isUnlimited: newUserData.isUnlimited
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
            is_unlimited: createdUser.isUnlimited
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

  const handleRechargeUser = async (userId: string, amount: number, isUnlimited: boolean) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          balance: isUnlimited ? 999999999 : amount,
          is_unlimited: isUnlimited
        })
        .eq('id', userId);
      
      if (error) throw error;

      setUsers(prev => prev.map(u => u.id === userId ? { 
        ...u, 
        balance: isUnlimited ? Infinity : amount,
        isUnlimited: isUnlimited 
      } : u));
      setNotification({ type: 'success', message: 'تم تحديث رصيد المستخدم بنجاح.' });
    } catch (error: any) {
      setNotification({ type: 'error', message: `فشل الشحن: ${error.message}` });
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
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold text-white">مرحباً، {currentUser.name}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Balance Card */}
              <div className="bg-[#111] border border-[#333] rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-slate-400 font-medium flex items-center gap-2 text-sm">
                      <Wallet size={18} />
                      الرصيد المتاح للتحويل
                    </h2>
                  </div>
                  <div className="text-3xl font-mono font-bold text-white tracking-tight" dir="ltr">
                    {formatCurrency(currentUser.balance, currentUser.isUnlimited)}
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#222] flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span>STATUS: ACTIVE</span>
                    <span>CURRENCY: USD</span>
                  </div>
                </div>
              </div>
              
              {/* Stats Card 1 */}
              <div className="bg-[#111] border border-[#333] rounded-xl p-6 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20"><Activity size={18} /></div>
                  <h3 className="text-sm font-bold text-slate-400">إجمالي التحويلات الصادرة</h3>
                </div>
                <p className="text-2xl font-mono font-bold text-white" dir="ltr">{formatCurrency(totalTransferred)}</p>
              </div>

              {/* Stats Card 2 */}
              <div className="bg-[#111] border border-[#333] rounded-xl p-6 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg border border-purple-500/20"><History size={18} /></div>
                  <h3 className="text-sm font-bold text-slate-400">العمليات المنجزة</h3>
                </div>
                <p className="text-2xl font-mono font-bold text-white">{totalTransactions} <span className="text-sm text-slate-500">عملية</span></p>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-[#111] border border-[#333] rounded-xl overflow-hidden mt-8">
              <div className="p-5 border-b border-[#222] flex items-center justify-between bg-[#141418]">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Terminal size={18} className="text-emerald-500" />
                  أحدث العمليات المشفرة
                </h3>
                <button onClick={() => setCurrentView('history')} className="text-xs text-emerald-500 font-mono hover:text-emerald-400">VIEW_ALL</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead className="bg-[#0a0a0a] text-slate-500 text-xs uppercase font-mono border-b border-[#222]">
                    <tr>
                      <th className="px-6 py-4">المستفيد</th>
                      <th className="px-6 py-4">المبلغ</th>
                      <th className="px-6 py-4">التاريخ</th>
                      <th className="px-6 py-4">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222]">
                    {recentTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-slate-600 font-mono text-sm">NO_TRANSACTIONS_FOUND</td>
                      </tr>
                    ) : recentTransactions.map(tx => (
                      <tr key={tx.id} className="hover:bg-[#16161a] transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-200">{tx.recipientName}</p>
                          <p className="text-xs text-slate-500 font-mono mt-1" dir="ltr">{tx.iban}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-mono font-bold text-white" dir="ltr">{formatCurrency(tx.amount)}</span>
                        </td>
                        <td className="px-6 py-4 text-xs font-mono text-slate-500" dir="ltr">{formatDate(tx.date)}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 size={12} /> SECURE_OK
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'transfer':
        return (
          <div className="max-w-2xl mx-auto animate-in fade-in duration-300">
            <div className="bg-[#111] border border-[#333] rounded-xl p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
              
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Send size={20} className="text-blue-500" />
                  تحويل آمن ومشفّر
                </h2>
                <div className="text-xs font-mono font-bold text-slate-400 bg-[#0a0a0a] px-3 py-2 rounded border border-[#333]">
                  الرصيد: <span className="text-white" dir="ltr">{formatCurrency(currentUser.balance, currentUser.isUnlimited)}</span>
                </div>
              </div>

              {notification && (
                <div className={`p-4 rounded-lg mb-6 flex items-start gap-3 border ${
                  notification.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                }`}>
                  {notification.type === 'success' ? <CheckCircle2 className="shrink-0 mt-0.5" size={18} /> : <AlertCircle className="shrink-0 mt-0.5" size={18} />}
                  <p className="text-sm font-medium">{notification.message}</p>
                </div>
              )}

              {isSubmitting ? (
                <div className="py-8 space-y-6">
                  <div className="flex items-center justify-between text-sm font-mono">
                    <span className="text-emerald-400 animate-pulse">{transferMessage}</span>
                    <span className="text-slate-500">{Math.round(transferProgress)}%</span>
                  </div>
                  <div className="w-full bg-[#0a0a0a] rounded-full h-3 border border-[#333] overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full transition-all duration-100 ease-linear relative"
                      style={{ width: `${transferProgress}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-[shimmer_1s_infinite] w-full"></div>
                    </div>
                  </div>
                  <div className="bg-[#0a0a0a] p-4 rounded border border-[#222] font-mono text-xs text-slate-500 space-y-2">
                    <p>{'>'} INITIALIZING SECURE PROTOCOL...</p>
                    <p>{'>'} BYPASSING REGIONAL RESTRICTIONS...</p>
                    {transferProgress > 30 && <p className="text-emerald-500/50">{'>'} CONNECTION ANONYMIZED.</p>}
                    {transferProgress > 60 && <p className="text-emerald-500/50">{'>'} PAYLOAD ENCRYPTED.</p>}
                    {transferProgress > 90 && <p className="text-emerald-500/50">{'>'} EXECUTING TRANSFER...</p>}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleTransferSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="recipientName" className="block text-sm font-bold text-slate-400 mb-2">اسم المستفيد</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-600">
                        <User size={18} />
                      </div>
                      <input
                        type="text"
                        id="recipientName"
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
                        className="block w-full pr-10 pl-3 py-3 border border-[#333] rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-[#141418] text-white transition-colors"
                        placeholder="الاسم الكامل"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="iban" className="block text-sm font-bold text-slate-400 mb-2">رقم الآيبان (IBAN)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-600">
                        <CreditCard size={18} />
                      </div>
                      <input
                        type="text"
                        id="iban"
                        value={transferData.iban}
                        onChange={(e) => setTransferData(prev => ({ ...prev, iban: e.target.value.toUpperCase().replace(/\s/g, '') }))}
                        dir="ltr"
                        className="block w-full pr-10 pl-3 py-3 border border-[#333] rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-[#141418] text-white transition-colors text-left font-mono"
                        placeholder="SA0000000000000000000000"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="amount" className="block text-sm font-bold text-slate-400 mb-2">المبلغ بالدولار</label>
                    <div className="relative">
                      <input
                        type="number"
                        id="amount"
                        value={transferData.amount}
                        onChange={(e) => setTransferData(prev => ({ ...prev, amount: e.target.value }))}
                        min="1"
                        step="0.01"
                        dir="ltr"
                        className="block w-full pr-3 pl-16 py-3 border border-[#333] rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-[#141418] text-white transition-colors text-left font-mono text-lg"
                        placeholder="0.00"
                      />
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r border-[#333] pr-3 my-2">
                        <span className="text-slate-500 font-mono font-bold">USD</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      type="submit"
                      className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-blue-500/50 rounded-lg shadow-lg text-sm font-bold text-blue-400 bg-blue-500/10 hover:bg-blue-500 hover:text-[#050505] focus:outline-none transition-all active:scale-[0.98]"
                    >
                      تأكيد وإرسال الحوالة
                      <ArrowUpRight size={18} />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">إدارة الصلاحيات والمستخدمين</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Add User Form */}
              <div className="lg:col-span-1">
                <div className="bg-[#111] border border-[#333] rounded-xl p-6 sticky top-6">
                  <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
                    <Plus size={18} className="text-emerald-500" />
                    إصدار تصريح جديد
                  </h3>

                  {notification && (
                    <div className={`p-3 rounded-lg mb-6 flex items-start gap-2 border text-xs ${
                      notification.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {notification.type === 'success' ? <CheckCircle2 className="shrink-0" size={14} /> : <AlertCircle className="shrink-0" size={14} />}
                      <p className="font-medium">{notification.message}</p>
                    </div>
                  )}

                  <form onSubmit={handleAddUser} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5">الاسم الكامل</label>
                      <input
                        type="text"
                        value={newUserData.name}
                        onChange={(e) => setNewUserData(prev => ({ ...prev, name: e.target.value }))}
                        className="block w-full px-3 py-2.5 border border-[#333] rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-[#141418] text-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5">معرف المستخدم</label>
                      <input
                        type="text"
                        value={newUserData.username}
                        onChange={(e) => setNewUserData(prev => ({ ...prev, username: e.target.value }))}
                        className="block w-full px-3 py-2.5 border border-[#333] rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-[#141418] text-white transition-colors font-mono"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5">مفتاح التشفير</label>
                      <input
                        type="text"
                        value={newUserData.password}
                        onChange={(e) => setNewUserData(prev => ({ ...prev, password: e.target.value }))}
                        className="block w-full px-3 py-2.5 border border-[#333] rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-[#141418] text-white transition-colors font-mono"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5">مستوى الصلاحية</label>
                      <select
                        value={newUserData.role}
                        onChange={(e) => setNewUserData(prev => ({ ...prev, role: e.target.value as Role }))}
                        className="block w-full px-3 py-2.5 border border-[#333] rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-[#141418] text-white transition-colors"
                      >
                        <option value="employee">موظف تحويلات</option>
                        <option value="manager">مدير نظام</option>
                        <option value="accountant">محاسب مالي</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-400 mb-1.5">
                          الرصيد المخصص (USD)
                        </label>
                        <input
                          type="number"
                          value={newUserData.balance}
                          disabled={newUserData.isUnlimited}
                          onChange={(e) => setNewUserData(prev => ({ ...prev, balance: e.target.value }))}
                          min="0"
                          className="block w-full px-3 py-2.5 border border-[#333] rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-[#141418] text-white transition-colors font-mono text-left disabled:opacity-50"
                          dir="ltr"
                        />
                      </div>
                      <div className="pt-6">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <div className={`w-10 h-5 rounded-full transition-colors relative ${newUserData.isUnlimited ? 'bg-emerald-500' : 'bg-[#222]'}`}>
                            <input 
                              type="checkbox" 
                              className="sr-only" 
                              checked={newUserData.isUnlimited}
                              onChange={(e) => setNewUserData(prev => ({ ...prev, isUnlimited: e.target.checked }))}
                            />
                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${newUserData.isUnlimited ? 'left-6' : 'left-1'}`}></div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-300">إنفينيتي</span>
                        </label>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 font-mono">AVAILABLE: {formatCurrency(currentUser.balance, currentUser.isUnlimited)}</p>
                    <button
                      type="submit"
                      className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-emerald-500/50 rounded-lg text-sm font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500 hover:text-[#050505] transition-all active:scale-[0.98] mt-4"
                    >
                      <Plus size={16} />
                      تأكيد وإصدار
                    </button>
                  </form>
                </div>
              </div>

              {/* Users List */}
              <div className="lg:col-span-2">
                <div className="bg-[#111] border border-[#333] rounded-xl overflow-hidden">
                  <div className="p-5 border-b border-[#222] flex items-center justify-between bg-[#141418]">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Users size={18} className="text-slate-400" />
                      سجل التصاريح النشطة
                    </h3>
                    <span className="bg-[#0a0a0a] border border-[#333] text-slate-400 text-xs font-mono px-2 py-1 rounded">
                      TOTAL: {users.length}
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-right">
                      <thead className="bg-[#0a0a0a] text-slate-500 text-xs uppercase font-mono border-b border-[#222]">
                        <tr>
                          <th className="px-6 py-4">الهوية</th>
                          <th className="px-6 py-4">المعرف</th>
                          <th className="px-6 py-4">المستوى</th>
                          <th className="px-6 py-4">الرصيد (USD)</th>
                          <th className="px-6 py-4">إجراءات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#222]">
                        {users.map(u => (
                          <tr key={u.id} className="hover:bg-[#16161a] transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-200 text-sm">{u.name}</td>
                            <td className="px-6 py-4 text-xs font-mono text-slate-400" dir="ltr">{u.username}</td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-mono font-bold bg-[#222] text-slate-300 border border-[#333]">
                                {getRoleIcon(u.role)} {u.role.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-mono font-bold text-white text-sm" dir="ltr">
                              {formatCurrency(u.balance, u.isUnlimited)}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => {
                                    const amount = prompt('أدخل المبلغ الجديد أو "inf" للرصيد اللانهائي:', u.isUnlimited ? 'inf' : u.balance.toString());
                                    if (amount !== null) {
                                      if (amount.toLowerCase() === 'inf') {
                                        handleRechargeUser(u.id, 999999999, true);
                                      } else {
                                        const num = parseFloat(amount);
                                        if (!isNaN(num)) handleRechargeUser(u.id, num, false);
                                      }
                                    }
                                  }}
                                  className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors"
                                  title="شحن الرصيد"
                                >
                                  <Zap size={16} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteUser(u.id)}
                                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                  title="حذف المستخدم"
                                >
                                  <Trash2 size={16} />
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
          <div className="bg-[#111] border border-[#333] rounded-xl overflow-hidden animate-in fade-in duration-300">
            <div className="p-5 border-b border-[#222] flex items-center justify-between bg-[#141418]">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <History size={18} className="text-slate-400" />
                سجل العمليات المشفرة
              </h2>
              <span className="bg-[#0a0a0a] border border-[#333] text-slate-400 text-xs font-mono px-2 py-1 rounded">
                RECORDS: {transactions.length}
              </span>
            </div>
            
            {transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-600 font-mono text-sm">
                <Terminal size={32} className="mb-4 opacity-50" />
                <p>NO_RECORDS_FOUND</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead className="bg-[#0a0a0a] text-slate-500 text-xs uppercase font-mono border-b border-[#222]">
                    <tr>
                      <th className="px-6 py-4">المرجع (TX_ID)</th>
                      <th className="px-6 py-4">المستفيد</th>
                      <th className="px-6 py-4">المبلغ</th>
                      <th className="px-6 py-4">التاريخ (UTC)</th>
                      <th className="px-6 py-4">المصدر</th>
                      <th className="px-6 py-4">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222]">
                    {transactions.map(tx => (
                      <tr key={tx.id} className="hover:bg-[#16161a] transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-xs font-mono text-slate-400 bg-[#0a0a0a] border border-[#333] px-2 py-1 rounded">{tx.id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-200">{tx.recipientName}</p>
                          <p className="text-xs text-slate-500 font-mono mt-1" dir="ltr">{tx.iban}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-mono font-bold text-white" dir="ltr">{formatCurrency(tx.amount)}</span>
                        </td>
                        <td className="px-6 py-4 text-xs font-mono text-slate-500" dir="ltr">{formatDate(tx.date)}</td>
                        <td className="px-6 py-4 text-xs font-mono text-slate-400">{tx.createdBy}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 size={12} /> SECURE_OK
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#050505] text-slate-300 font-sans flex overflow-hidden selection:bg-emerald-500/30">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 right-0 z-50 w-72 bg-[#0a0a0a] border-l border-[#222] transition-transform duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 lg:static lg:block
      `}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#222] bg-[#050505]">
          <div className="flex items-center gap-3 text-white">
            <ShieldCheck size={24} className="text-emerald-500" />
            <span className="font-bold text-lg tracking-tight">نظام التحويلات</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 border-b border-[#222] bg-[#0a0a0a]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#111] border border-[#333] flex items-center justify-center text-white font-mono font-bold text-xl shrink-0">
              {currentUser.username.substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-sm truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-500 font-mono mt-1 flex items-center gap-1 uppercase truncate">
                {getRoleIcon(currentUser.role)}
                {currentUser.role}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-sm ${
                  isActive 
                    ? 'bg-[#1a1a24] text-white border border-[#333]' 
                    : 'text-slate-400 hover:bg-[#111] hover:text-white border border-transparent'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-emerald-500' : 'text-slate-500'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#222] bg-[#050505]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-colors font-medium text-sm"
          >
            <LogOut size={18} />
            إنهاء الجلسة
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[#050505]">
        {/* Top Header */}
        <header className="bg-[#0a0a0a] border-b border-[#222] h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:bg-[#111] rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-sm font-bold text-white hidden sm:block">
              {navItems.find(i => i.id === currentView)?.label}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded border border-emerald-500/20">
              <Globe size={14} />
              <span dir="ltr">IP: 198.51.100.42 (Arizona, USA) - SECURE</span>
            </div>
            <div className="flex flex-col items-end sm:ml-4">
              <span className="text-[9px] font-mono text-slate-500 uppercase leading-none mb-1">Balance</span>
              <span className="text-xs sm:text-sm font-mono font-bold text-emerald-400 leading-none" dir="ltr">{formatCurrency(currentUser.balance)}</span>
            </div>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto">
            {renderView()}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showAnimation && (
          <TransferAnimation onComplete={handleAnimationComplete} />
        )}
      </AnimatePresence>
    </div>
  );
}
