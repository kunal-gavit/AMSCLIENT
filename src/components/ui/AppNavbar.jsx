import { Menu, UserCircle2 } from "lucide-react";

const AppNavbar = ({ title = "MITAOE Smart Attendance & Academic Intelligence System", user = null, onMenuToggle }) => {
  return (
    <header className="navbar-academic">
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button
            type="button"
            onClick={onMenuToggle}
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>
        )}
        <div className="navbar-title">{title}</div>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <UserCircle2 size={20} />
        <div className="hidden sm:block">
          <p className="font-semibold leading-tight">{user?.name || "Student User"}</p>
          <p className="text-[11px] text-blue-100 leading-tight">{user?.role || "student"}</p>
        </div>
      </div>
    </header>
  );
};

export default AppNavbar;
