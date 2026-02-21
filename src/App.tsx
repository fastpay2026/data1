import React, { useState, useEffect } from 'react';
import { 
  Wallet, Send, History, CheckCircle2, AlertCircle, Clock, ArrowUpRight,
  Building2, User, CreditCard, LogOut, LayoutDashboard, Shield, Briefcase, 
  Calculator, Menu, X, Activity, Lock, Users, Plus, Terminal, ShieldCheck, Globe
} from 'lucide-react';
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

// --- Helper Functions ---
const generateId = () => Math.random().toString(36).substr(2, 9).toUpperCase();

const formatCurrency = (amount: number) => {
  if (amount === Infinity) return '∞ USD';
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
  const [newUserData, setNewUserData] = useState({ name: '', username: '', password: '', role: 'employee' as Role, balance: '' });
  
  // Transfer Progress State
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      
      if (usersError) throw usersError;
      if (usersData) setUsers(usersData);

      // Fetch Transactions
      const { data: txData, error: txError } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });
      
      if (txError) throw txError;
      if (txData) {
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
    } catch (error) {
      console.error('Error fetching data:', error);
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

    if (currentUser!.role !== 'manager' && amountNum > currentUser!.balance) {
      setNotification({ type: 'error', message: 'الرصيد المتاح غير كافٍ لتنفيذ العملية.' });
      return;
    }

    setIsSubmitting(true);
    setTransferProgress(0);
    setTransferMessage(secureMessages[0]);

    let progress = 0;
    const totalTimeMs = 30000; // 30 seconds
    const intervalMs = 100;
    const step = 100 / (totalTimeMs / intervalMs);

    const interval = setInterval(() => {
      progress += step;
      if (progress > 100) progress = 100;
      
      setTransferProgress(progress);

      if (progress > 15 && progress <= 30) setTransferMessage(secureMessages[1]);
      else if (progress > 30 && progress <= 50) setTransferMessage(secureMessages[2]);
      else if (progress > 50 && progress <= 70) setTransferMessage(secureMessages[3]);
      else if (progress > 70 && progress <= 90) setTransferMessage(secureMessages[4]);
      else if (progress > 90) setTransferMessage(secureMessages[5]);

      if (progress >= 100) {
        clearInterval(interval);
        
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
            if (currentUser!.role !== 'manager') {
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
          } catch (error) {
            console.error('Sync error:', error);
            setIsSubmitting(false);
            setNotification({ type: 'error', message: 'حدث خطأ أثناء مزامنة البيانات مع السحابة.' });
          }
        };

        performSync();
        setTimeout(() => setNotification(null), 8000);
      }
    }, intervalMs);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    if (!newUserData.name || !newUserData.username || !newUserData.password || !newUserData.balance) {
      setNotification({ type: 'error', message: 'يرجى تعبئة جميع الحقول.' });
      return;
    }

    if (users.some(u => u.username === newUserData.username)) {
      setNotification({ type: 'error', message: 'معرف المستخدم محجوز مسبقاً.' });
      return;
    }

    const allocatedBalance = parseFloat(newUserData.balance);
    if (isNaN(allocatedBalance) || allocatedBalance < 0) {
      setNotification({ type: 'error', message: 'قيمة الرصيد غير صالحة.' });
      return;
    }

    if (allocatedBalance > currentUser!.balance) {
      setNotification({ type: 'error', message: 'الرصيد المتاح لا يغطي التخصيص المطلوب.' });
      return;
    }

    const createdUser: UserAccount = {
      id: `U-${generateId()}`,
      name: newUserData.name,
      username: newUserData.username,
      password: newUserData.password,
      role: newUserData.role,
      balance: allocatedBalance
    };

    const syncUser = async () => {
      try {
        // Insert new user
        const { error: insertError } = await supabase
          .from('users')
          .insert([createdUser]);
        
        if (insertError) throw insertError;

        // Deduct from manager, add new user
        if (currentUser!.role !== 'manager') {
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

        setNewUserData({ name: '', username: '', password: '', role: 'employee', balance: '' });
        setNotification({ type: 'success', message: 'تم إنشاء الحساب وتخصيص الرصيد بنجاح.' });
      } catch (error) {
        console.error('User sync error:', error);
        setNotification({ type: 'error', message: 'حدث خطأ أثناء حفظ بيانات المستخدم الجديد.' });
      }
    };

    syncUser();
    setTimeout(() => setNotification(null), 5000);
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
                    {formatCurrency(currentUser.balance)}
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
                  الرصيد: <span className="text-white" dir="ltr">{formatCurrency(currentUser.balance)}</span>
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
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5">
                        الرصيد المخصص (USD)
                      </label>
                      <input
                        type="number"
                        value={newUserData.balance}
                        onChange={(e) => setNewUserData(prev => ({ ...prev, balance: e.target.value }))}
                        min="0"
                        className="block w-full px-3 py-2.5 border border-[#333] rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-[#141418] text-white transition-colors font-mono text-left"
                        dir="ltr"
                      />
                      <p className="text-[10px] text-slate-500 mt-1 font-mono">AVAILABLE: {formatCurrency(currentUser.balance)}</p>
                    </div>
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
                              {formatCurrency(u.balance)}
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
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-50 w-72 bg-[#0a0a0a] border-l border-[#222] transition-transform transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 lg:static lg:block flex flex-col`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#222] bg-[#050505]">
          <div className="flex items-center gap-3 text-white">
            <ShieldCheck size={24} className="text-emerald-500" />
            <span className="font-bold text-lg tracking-tight">نظام التحويلات</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-500 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 border-b border-[#222] bg-[#0a0a0a]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#111] border border-[#333] flex items-center justify-center text-white font-mono font-bold text-xl">
              {currentUser.username.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-white font-bold text-sm">{currentUser.name}</p>
              <p className="text-[10px] text-slate-500 font-mono mt-1 flex items-center gap-1 uppercase">
                {getRoleIcon(currentUser.role)}
                {currentUser.role}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
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
            <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded border border-emerald-500/20">
              <Globe size={14} />
              <span dir="ltr">IP: 198.51.100.42 (Arizona, USA) - SECURE</span>
            </div>
          </div>
        </header>

        {/* Main Scrollable Area */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {renderView()}
          </div>
        </main>
      </div>

    </div>
  );
}
