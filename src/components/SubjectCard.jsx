import { AlertCircle, CheckCircle2, AlertTriangle, TrendingUp, TrendingDown, Minus, ChevronRight, Activity } from "lucide-react";
import { motion } from "framer-motion";

const SubjectCard = ({ data, onSimulate }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case "Safe": return { color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100", icon: CheckCircle2, shadow: "shadow-emerald-500/10" };
      case "Warning": return { color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100", icon: AlertTriangle, shadow: "shadow-amber-500/10" };
      case "At Risk": return { color: "text-rose-500", bg: "bg-rose-50", border: "border-rose-100", icon: AlertCircle, shadow: "shadow-rose-500/10" };
      default: return { color: "text-slate-400", bg: "bg-slate-50", border: "border-slate-200", icon: Minus, shadow: "shadow-slate-200/10" };
    }
  };

  const getTrendIcon = (trend) => {
    if (trend === "Improving") return <TrendingUp className="text-emerald-500" size={16} />;
    if (trend === "Declining") return <TrendingDown className="text-rose-500" size={16} />;
    return <Minus className="text-slate-300" size={16} />;
  };

  const config = getStatusConfig(data.status);
  const Icon = config.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10 }}
      className={`card-premium p-10 relative overflow-hidden group transition-all duration-700 ${config.shadow}`}
    >
      <div className={`absolute -right-8 -top-8 w-32 h-32 ${config.bg} opacity-20 rounded-full blur-3xl transition-all duration-1000 group-hover:scale-150`} />
      
      <div className="flex justify-between items-start mb-10 relative z-10">
        <div className="space-y-4">
          <h3 className="text-2xl font-black text-slate-800 tracking-tighter leading-tight">{data.subject}</h3>
          <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-[1rem] border border-slate-100 w-fit">
            {getTrendIcon(data.trend)}
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{data.trend} Pattern</span>
          </div>
        </div>
        <div className={`px-4 py-2.5 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border bg-white ${config.color} ${config.border} shadow-sm group-hover:scale-110 transition-transform duration-500`}>
          <Icon size={16} className="animate-pulse" />
          {data.status}
        </div>
      </div>

      <div className="flex items-end gap-3 mb-8 relative z-10">
        <span className="text-6xl font-black text-slate-900 tracking-tighter tabular-nums">{data.percentage}%</span>
        <div className="pb-2">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Telemetry</p>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-tighter">({data.attended}/{data.total} LECTIONS)</p>
        </div>
      </div>

      <div className="w-full bg-slate-50 h-3.5 rounded-full mb-10 overflow-hidden border border-slate-100 p-0.5 shadow-inner">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: `${data.percentage}%` }}
          viewport={{ once: true }}
          className={`h-full rounded-full transition-all duration-1500 ease-out relative
            ${data.percentage >= 75 
                ? 'bg-gradient-to-r from-primary to-primary-light shadow-[0_0_15px_-2px_#7c3aed]' 
                : 'bg-gradient-to-r from-rose-500 to-rose-400 shadow-[0_0_15px_-2px_#f43f5e]'}`}
        >
            <div className="absolute top-0 right-0 w-2 h-full bg-white/20 animate-shimmer" />
        </motion.div>
      </div>

      <div className="space-y-6 relative z-10">
        {data.percentage < 75 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 bg-rose-50 rounded-[2rem] border border-rose-100 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-2">
                <Activity size={14} className="text-rose-400" />
                <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest leading-none">Strategic Deficiency</p>
            </div>
            <p className="text-sm text-slate-700 font-medium">
              Establish contact with <span className="text-xl font-black text-rose-600 tracking-tighter mx-1">{data.classesNeeded}</span> lecture units to reset equilibrium to 75%.
            </p>
          </motion.div>
        ) : (
          <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100">
            <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest leading-none">Optimal Status</p>
            </div>
            <p className="text-sm text-slate-700 font-medium">
              Bio-mathematical requirements satisfied. Operational margins within safe parameters.
            </p>
          </div>
        )}
        
        <button 
          onClick={() => onSimulate(data)}
          className="w-full flex items-center justify-center gap-3 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-primary bg-primary/5 rounded-[1.5rem] border-2 border-transparent hover:border-primary/20 hover:bg-primary hover:text-white transition-all duration-500 shadow-sm group/btn"
        >
          Tactical Simulator
          <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

export default SubjectCard;
