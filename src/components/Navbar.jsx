import useAuth from "../context/useAuth";
import { LogOut, UserCircle2, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white/95 backdrop-blur-xl border-b border-slate-200 px-4 md:px-8 py-4 flex justify-between items-center sticky top-0 z-[80] shadow-sm">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 px-4 py-2 bg-primary rounded-xl text-white shadow-lg">
           <Zap size={18} className="text-accent fill-accent" />
           <span className="text-[10px] font-black uppercase tracking-[0.22em]">MITAOE Nexus</span>
        </div>
        <div className="h-6 w-px bg-slate-200 hidden md:block" />
        <h1 className="text-lg md:text-xl font-black text-primary tracking-tight hidden md:block">
          {user?.role === 'admin' ? 'System Oversight' : user?.role === 'teacher' ? 'Faculty Command' : 'Intelligence Hub'}
        </h1>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        <div className="flex items-center gap-4 px-4 md:px-5 py-2.5 bg-background rounded-xl border border-slate-200 group cursor-pointer hover:bg-white hover:shadow-premium transition-all">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-slate-800 leading-none mb-1">{user?.name}</p>
            <p className="text-[9px] font-black text-secondary uppercase tracking-widest">{user?.role}</p>
          </div>
          {user?.profileImage ? (
            <img src={user.profileImage} alt="Profile" className="w-10 h-10 rounded-xl object-cover shadow-sm border border-slate-200" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center font-black text-primary text-xl">
              {user?.name[0]}
            </div>
          )}
        </div>

        <Link
          to="/profile"
          className="p-3 bg-primary/10 text-primary rounded-xl border border-primary/20 hover:bg-primary hover:text-white transition-all shadow-sm"
          title="Profile"
        >
          <UserCircle2 size={20} />
        </Link>

        <button 
          onClick={logout}
          className="p-3 bg-danger/10 text-danger rounded-xl border border-danger/20 hover:bg-danger hover:text-white transition-all shadow-sm group"
          title="Terminate Session"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
