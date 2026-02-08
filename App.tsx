
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, UserPlus, ClipboardCheck, ExternalLink, Menu, X, Users, Copy, CheckCircle, BarChart3, LogOut, RefreshCw } from 'lucide-react';
import { Airman } from './types';
import Dashboard from './components/Dashboard';
import AirmanForm from './components/AirmanForm';
import PendingReview from './components/PendingReview';
import PublicForm from './components/PublicForm';
import Overview from './components/Overview';
import Login from './components/Login';
import { supabase } from './supabase';

const App: React.FC = () => {
  const [airmen, setAirmen] = useState<Airman[]>([]);
  const [pendingAirmen, setPendingAirmen] = useState<Airman[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState(true);
  const location = useLocation();

  // Utility to clean data for Supabase
  const cleanForSupabase = (data: any) => {
    const cleaned = { ...data };
    // Postgres DATE and INTEGER types do not accept empty strings.
    // We convert all empty strings to null or delete them.
    Object.keys(cleaned).forEach(key => {
      if (cleaned[key] === '') {
        cleaned[key] = null; 
      }
    });
    return cleaned;
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setAuthChecking(false);
      if (session) fetchData();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session) fetchData();
      else {
        setAirmen([]);
        setPendingAirmen([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('airmen')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) throw error;

      if (data) {
        const active = data.filter((a: Airman) => a.status === 'active');
        const pending = data.filter((a: Airman) => a.status === 'pending');
        setAirmen(active);
        setPendingAirmen(pending);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    fetchData();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  };

  const addAirman = async (data: Airman) => {
    const { id, ...insertData } = data;
    const cleaned = cleanForSupabase({ ...insertData, status: 'active' });
    
    const { error } = await supabase
      .from('airmen')
      .insert([cleaned]);
    
    if (!error) {
      fetchData();
    } else {
      console.error('Insert error:', error);
      alert(`Failed to add airman: ${error.message}`);
    }
  };

  const updateAirman = async (updatedAirman: Airman) => {
    const cleaned = cleanForSupabase(updatedAirman);
    const { error } = await supabase
      .from('airmen')
      .update(cleaned)
      .eq('id', updatedAirman.id);

    if (!error) fetchData();
    else {
      console.error('Update error:', error);
      alert(`Failed to update record: ${error.message}`);
    }
  };

  const submitToPending = async (data: Airman) => {
    const { id, ...insertData } = data;
    const cleaned = cleanForSupabase({ ...insertData, status: 'pending' });
    
    const { error } = await supabase
      .from('airmen')
      .insert([cleaned]);
    
    if (!error) fetchData();
    else {
      console.error('Pending submission error:', error);
      alert(`Submission failed: ${error.message}`);
    }
  };

  const approvePending = async (id: string) => {
    const { error } = await supabase
      .from('airmen')
      .update({ status: 'active' })
      .eq('id', id);

    if (!error) fetchData();
  };

  const rejectPending = async (id: string) => {
    const { error } = await supabase
      .from('airmen')
      .delete()
      .eq('id', id);

    if (!error) fetchData();
  };

  const deleteAirman = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this record forever?')) {
      const { error } = await supabase
        .from('airmen')
        .delete()
        .eq('id', id);

      if (!error) fetchData();
    }
  };

  const copyPublicLink = () => {
    const url = window.location.origin + window.location.pathname + '#/submit';
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const isPublicRoute = location.pathname === '/submit';

  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <RefreshCw className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  if (isPublicRoute) {
    return (
      <Routes>
        <Route path="/submit" element={<PublicForm onSubmit={submitToPending} />} />
      </Routes>
    );
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50 overflow-hidden text-slate-900">
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col shadow-2xl">
          <div className="p-8 border-b border-slate-800 flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-xl shadow-blue-600/30">
              <Users size={28} />
            </div>
            <div>
              <h1 className="font-black text-xl leading-tight uppercase tracking-tighter">BAF Airmen</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Cloud Database Active</p>
            </div>
          </div>

          <nav className="flex-1 p-6 space-y-3 overflow-y-auto">
            <SidebarLink to="/" icon={<BarChart3 size={22} />} label="Overview" />
            <SidebarLink to="/list" icon={<LayoutDashboard size={22} />} label="Personnel List" />
            <SidebarLink to="/entry" icon={<UserPlus size={22} />} label="Add Airman" />
            <SidebarLink to="/review" icon={<ClipboardCheck size={22} />} badge={pendingAirmen.length} label="Review Inbox" />
          </nav>

          <div className="p-6 border-t border-slate-800 space-y-4">
            <div className="bg-slate-800 rounded-3xl p-6 text-sm relative overflow-hidden group">
              <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-3">Public Gateway Link</p>
              <div className="space-y-3">
                <Link to="/submit" target="_blank" className="flex items-center gap-3 text-blue-400 hover:text-blue-300 font-bold transition-all">
                  <div className="bg-blue-400/10 p-2 rounded-xl"><ExternalLink size={18} /></div>
                  Open Form
                </Link>
                <button 
                  onClick={copyPublicLink}
                  className="w-full flex items-center justify-between gap-3 text-slate-300 hover:text-white font-bold transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-700 p-2 rounded-xl">
                      {copied ? <CheckCircle size={18} className="text-green-400" /> : <Copy size={18} />}
                    </div>
                    {copied ? 'Copied!' : 'Copy Link'}
                  </div>
                </button>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-5 py-4 text-red-400 hover:bg-red-400/10 rounded-2xl transition-all font-black text-sm uppercase"
            >
              <LogOut size={22} />
              Logout Session
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 no-print shadow-sm z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)} 
              className="lg:hidden p-3 hover:bg-slate-100 rounded-2xl transition-all"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
              {location.pathname === '/' ? 'System Overview' : 
               location.pathname === '/list' ? 'Personnel Directory' :
               location.pathname === '/entry' ? 'Personnel Enrollment' : 'Entry Review Board'}
            </h2>
          </div>
          
          <div className="flex items-center gap-4 no-print">
            <button 
              onClick={fetchData} 
              disabled={loading}
              className={`p-3 rounded-full hover:bg-slate-100 transition-all ${loading ? 'animate-spin' : ''}`}
              title="Sync Database"
            >
              <RefreshCw size={20} className="text-slate-400" />
            </button>
            <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live: Supabase Connected</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-slate-50/50">
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-4">
                <RefreshCw className="animate-spin text-blue-600" size={32} />
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Synchronizing Cloud Data...</p>
              </div>
            </div>
          )}
          {!loading && (
            <Routes>
              <Route path="/" element={<Overview data={airmen} />} />
              <Route path="/list" element={<Dashboard data={airmen} onDelete={deleteAirman} onUpdate={updateAirman} />} />
              <Route path="/entry" element={<AirmanForm onSubmit={addAirman} />} />
              <Route path="/review" element={<PendingReview data={pendingAirmen} onApprove={approvePending} onReject={rejectPending} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </div>
      </main>
    </div>
  );
};

const SidebarLink: React.FC<{ to: string; icon: React.ReactNode; label: string; badge?: number }> = ({ to, icon, label, badge }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className={`
        flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-200
        ${isActive ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/40 translate-x-1' : 'text-slate-500 hover:bg-slate-800 hover:text-white'}
      `}
    >
      <div className="flex items-center gap-4">
        {icon}
        <span className="font-black text-sm uppercase tracking-tight">{label}</span>
      </div>
      {badge ? (
        <span className="bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-xl shadow-lg shadow-red-500/30">
          {badge}
        </span>
      ) : null}
    </Link>
  );
};

export default App;
