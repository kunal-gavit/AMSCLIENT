import useAuth from "../context/useAuth";
import { 
  LogOut, 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Activity,
  Layers
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = {
    student: [
      { name: "Intelligence Hub", icon: LayoutDashboard, path: "/student/hub" },
      { name: "My Analytics", icon: TrendingUp, path: "/student/analytics" },
      { name: "Domain Registry", icon: BookOpen, path: "/student/domains" },
    ],
    teacher: [
      { name: "Command Center", icon: LayoutDashboard, path: "/teacher" },
      { name: "Tactical Control", icon: Activity, path: "/teacher/control" },
      { name: "Intelligence Reports", icon: Layers, path: "/teacher/reports" },
    ],
    admin: [
      { name: "Nexus Admin", icon: LayoutDashboard, path: "/admin" },
      { name: "Security Audits", icon: ShieldCheck, path: "/admin/security" },
      { name: "Unit Management", icon: Users, path: "/admin/users" },
    ]
  };

  const currentMenu = menuItems[user?.role] || [];

  return (
    <aside className="w-80 h-screen sticky top-0 bg-white border-r border-slate-100 flex flex-col z-[70] transition-all duration-700">
      {/* Brand Header */}
      <div className="p-12">
        <Link to="/" className="flex items-center gap-5 group">
          <div className="relative">
            <div className="absolute -inset-2 bg-primary/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-700" />
            <div className="relative bg-slate-900 p-4 rounded-2xl shadow-2xl group-hover:bg-primary transition-all duration-500 transform group-hover:rotate-6">
                <Zap className="text-white w-6 h-6 fill-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tighter leading-[0.8] mb-1">NEXUS</h1>
            <p className="text-[9px] font-black text-primary uppercase tracking-[0.4em]">Core OS v2.0</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-8 space-y-4">
        <div className="px-5 mb-8">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Access Level: {user?.role}</p>
        </div>
        {currentMenu.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={`${item.name}-${item.path}`}
              to={item.path}
              className={`flex items-center gap-4 px-6 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all duration-500 group relative
                ${isActive 
                  ? 'bg-slate-900 text-white shadow-massive' 
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900 border border-transparent hover:border-slate-100'}`}
            >
              <item.icon size={20} className={`${isActive ? 'text-primary' : 'text-slate-300'} group-hover:scale-110 transition-transform duration-500`} />
              <span>{item.name}</span>
              
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_#7c3aed]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Session Tactical Card */}
      <div className="p-10">
        <div className="p-8 rounded-[3rem] bg-slate-950 text-white relative overflow-hidden shadow-massive group/card">
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 -mr-20 -mt-20 rounded-full blur-[60px] group-hover/card:bg-primary/30 transition-all duration-1000" />
          
          <div className="flex items-center gap-5 mb-10">
            <div className="w-16 h-16 rounded-[1.25rem] bg-white/10 backdrop-blur-3xl flex items-center justify-center font-black text-white text-2xl border border-white/10 shadow-inner group-hover/card:scale-110 transition-transform duration-700">
              {user?.name[0]}
            </div>
            <div className="overflow-hidden">
              <p className="font-black text-white leading-none mb-2 text-xl tracking-tighter truncate">{user?.name.split(' ')[0]}</p>
              <div className="flex flex-col gap-1.5">
                <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-white/5 border border-white/5 self-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#7c3aed]" />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{user?.role} NODE</p>
                </div>
                {user?.role === 'student' && user?.profile && (
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter truncate">
                    {user.profile.branch} • Year {user.profile.year}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <button 
            onClick={logout}
            className="w-full flex items-center justify-between px-6 py-5 bg-white/5 hover:bg-rose-500 text-white/50 hover:text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-[1.5rem] border border-white/5 transition-all duration-700 group/btn shadow-inner"
          >
            <div className="flex items-center gap-4">
              <LogOut size={18} className="group-hover/btn:-translate-x-1 transition-transform" />
              <span>De-auth</span>
            </div>
            <ChevronRight size={16} className="opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
