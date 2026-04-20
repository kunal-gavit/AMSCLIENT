import { useState, useEffect } from "react";
import useAuth from "../context/useAuth";
import { Users, BookOpen, GraduationCap, Database, Activity, Search, ShieldCheck, Zap, Globe, Cpu, Lock, ChevronRight, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { adminApi } from "../services/api";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [enrollData, setEnrollData] = useState({ studentId: "", subjectId: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, subjectsRes] = await Promise.all([
          adminApi.getStats(),
          adminApi.getSubjects(),
        ]);
        
        const data = statsRes.data;
        setStats({
          totalStudents: data.totalStudents,
          totalTeachers: data.totalTeachers,
          totalSubjects: data.totalSubjects,
          totalRecords: data.totalRecords,
          systemHealth: data.health,
          uptime: "99.99%"
        });
        setSubjects(subjectsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?._id]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    try {
      const { data } = await adminApi.searchStudents(searchQuery);
      setSearchResults(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEnroll = async (e) => {
    e.preventDefault();
    if (!enrollData.studentId || !enrollData.subjectId) return;
    try {
      await adminApi.enrollStudent(enrollData);
      alert("Enrollment protocol successfully executed.");
      setEnrollData({ studentId: "", subjectId: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Enrollment failure.");
    }
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-[60vh] space-y-8">
      <div className="relative">
        <div className="w-24 h-24 border-b-4 border-primary rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <ShieldCheck className="text-primary animate-pulse" size={32} />
        </div>
      </div>
      <p className="font-black text-[10px] uppercase tracking-[0.5em] text-slate-400 animate-pulse">Establishing Secure Neural Bridge</p>
    </div>
  );

  return (
    <div className="space-y-16 pb-20">
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-900 rounded-full text-white border border-white/10 shadow-xl">
            <Lock size={14} className="text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Administrative Security Clearance: Level 5</span>
          </div>
          <h2 className="text-6xl font-black text-slate-800 tracking-tighter">System Nexus</h2>
          <p className="text-slate-500 text-xl font-medium max-w-2xl">Global meta-analysis and core logistical control of the Academic Intelligence Collective.</p>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-premium p-8 flex items-center gap-10 border-2 border-primary/10 shadow-premium"
        >
          <div className="p-5 bg-primary/10 rounded-[1.5rem] text-primary shadow-inner">
            <ShieldCheck size={32} />
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Security Protocol</p>
            <p className="text-3xl font-black text-slate-800 tracking-tighter">OPERATIONAL</p>
          </div>
        </motion.div>
      </header>

      {/* Core Infrastructure Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: "Active Nodes", value: stats.totalStudents, icon: GraduationCap, color: "bg-primary", sub: "Verified Personnel" },
          { label: "Faculty Units", value: stats.totalTeachers, icon: Users, color: "bg-indigo-600", sub: "Strategic Leads" },
          { label: "Domain Assets", value: stats.totalSubjects, icon: BookOpen, color: "bg-emerald-600", sub: "Registry Items" },
          { label: "Data Telemetry", value: stats.totalRecords, icon: Database, color: "bg-amber-600", sub: "Interaction Logs" },
        ].map((item, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -10 }}
            className="card-premium p-10 relative overflow-hidden group border border-slate-100"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 ${item.color} opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 -mr-16 -mt-16 rounded-full blur-3xl`} />
            <div className={`inline-flex p-5 rounded-[1.5rem] ${item.color} text-white mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
              <item.icon size={28} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">{item.label}</p>
            <h4 className="text-5xl font-black text-slate-800 tracking-tighter tabular-nums mb-3">{item.value.toLocaleString()}</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-60 leading-none">{item.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        <div className="xl:col-span-8 space-y-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-premium p-12 lg:p-16"
          >
            <div className="flex justify-between items-center mb-16">
                <h3 className="text-3xl font-black flex items-center gap-6 tracking-tighter text-slate-800">
                  <div className="p-4 bg-slate-900 text-white rounded-[1.5rem] shadow-xl">
                    <Search size={28} />
                  </div>
                  Global Personnel Search
                </h3>
                <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-xl">
                    <Globe size={14} className="text-slate-400" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Indexing</span>
                </div>
            </div>
            
            <form onSubmit={handleSearch} className="relative group mb-16">
              <input 
                type="text" 
                className="input-nexus pl-16 py-8 text-xl tracking-tight"
                placeholder="Query by name, unique ID, or institutional identifier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={28} />
              <button 
                className="absolute right-4 top-1/2 -translate-y-1/2 btn-nexus !py-5 !px-10"
              >
                Execute Analysis
              </button>
            </form>

            <AnimatePresence mode="wait">
              {searchResults.length > 0 ? (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  {searchResults.map((result, i) => (
                    <motion.div 
                        key={result._id} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="group p-8 rounded-[2.5rem] bg-slate-50/50 border border-slate-100 hover:border-primary/20 hover:bg-white transition-all duration-500 flex justify-between items-center"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-[1.25rem] bg-white shadow-premium border border-slate-50 flex items-center justify-center font-black text-primary text-2xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
                          {result.name[0]}
                        </div>
                        <div>
                          <h4 className="font-black text-xl text-slate-800 tracking-tight leading-none mb-2">{result.name}</h4>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{result.branch} UNIT • {result.rollNo || 'FACULTY'}</p>
                        </div>
                      </div>
                      <ChevronRight size={24} className="text-slate-200 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-24 text-center"
                >
                  <div className="inline-flex p-12 bg-slate-50 rounded-[3rem] mb-8 border border-slate-100">
                    <Database className="text-slate-200" size={72} />
                  </div>
                  <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-xs">Query Engine Standing By</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Diagnostic Systems */}
        <div className="xl:col-span-4 space-y-12">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900 p-12 rounded-[3.5rem] text-white shadow-premium relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[100px] group-hover:bg-primary/20 transition-all duration-1000 -mr-40 -mt-40" />
            <h3 className="text-3xl font-black mb-12 flex items-center gap-5 relative z-10 text-primary-light">
              <Activity className="animate-pulse" size={32} />
              Nexus Bio-Health
            </h3>
            <div className="space-y-10 relative z-10">
              {[
                { label: "Core Processing", value: "12%", color: "bg-primary", icon: Cpu, sub: "Primary Cluster" },
                { label: "Neural Latency", value: "24ms", color: "bg-emerald-500", icon: Zap, sub: "Edge Nodes Active" },
                { label: "Security Threads", value: "Verified", color: "bg-indigo-400", icon: ShieldCheck, sub: "Layer 7 Integrity" }
              ].map((stat, i) => (
                <div key={i} className="group cursor-default">
                    <div className="flex justify-between items-end mb-4">
                        <div className="flex items-center gap-4">
                            <stat.icon size={18} className="text-slate-500" />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">{stat.label}</p>
                                <p className="text-sm font-bold text-slate-300">{stat.sub}</p>
                            </div>
                        </div>
                        <span className="text-2xl font-black tabular-nums">{stat.value}</span>
                    </div>
                    {stat.value.includes('%') && (
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: stat.value }}
                                className="h-full bg-primary rounded-full shadow-[0_0_15px_rgb(124,58,237,0.5)]" 
                            />
                        </div>
                    )}
                </div>
              ))}
            </div>
            
            <div className="mt-12 p-8 bg-white/5 rounded-[2.5rem] border border-white/5 backdrop-blur-3xl">
                <div className="flex items-center gap-4 mb-3">
                    <Terminal size={18} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">System Telemetry</span>
                </div>
                <p className="text-xs font-bold leading-relaxed opacity-50 italic">
                  Cluster-04 synchronization detected 24ms jitter. Corrective algorithms initialized and verified.
                </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-premium p-10 relative overflow-hidden"
          >
             <div className="flex items-center justify-between mb-12">
                <h4 className="font-black text-2xl text-slate-800 tracking-tight">Access Protocol Logs</h4>
                <div className="p-3 bg-slate-900 text-white rounded-2xl">
                    <Lock size={20} />
                </div>
             </div>
             
             <div className="space-y-8">
               {[
                 { action: "Database Snapshot", time: "2h ago", status: "Integrity Ok", variant: "success" },
                 { action: "API Handshake", time: "5h ago", status: "Verified", variant: "success" },
                 { action: "Anomalous Sync", time: "12h ago", status: "Audit Log", variant: "warning" }
               ].map((log, i) => (
                 <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-5">
                      <div className={`w-3 h-3 rounded-full ${log.variant === 'warning' ? 'bg-amber-400' : 'bg-emerald-400'} shadow-[0_0_10px_currentColor] group-hover:scale-150 transition-transform`} />
                      <div>
                        <p className="font-black text-slate-700 tracking-tight text-lg leading-none mb-2">{log.action}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{log.time}</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest ${log.variant === 'warning' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                      {log.status}
                    </span>
                 </div>
               ))}
              </div>
              
              <button className="btn-nexus w-full mt-12 !py-6">
                Execute Full System Audit
              </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-premium p-10 space-y-10 border-2 border-primary/20 bg-primary/5"
          >
            <div className="flex items-center justify-between mb-2">
                <h4 className="font-black text-2xl text-slate-800 tracking-tight">Enrollment Console</h4>
                <div className="p-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20">
                    <Zap size={20} />
                </div>
            </div>

            <form onSubmit={handleEnroll} className="space-y-8">
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Target Student ID</label>
                  <input 
                    type="text" 
                    placeholder="Enter unique student identifier..."
                    className="input-nexus !py-5 bg-white"
                    value={enrollData.studentId}
                    onChange={(e) => setEnrollData({...enrollData, studentId: e.target.value})}
                  />
               </div>

               <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Domain Selection</label>
                  <select 
                    className="input-nexus !py-5 bg-white appearance-none cursor-pointer"
                    value={enrollData.subjectId}
                    onChange={(e) => setEnrollData({...enrollData, subjectId: e.target.value})}
                  >
                    <option value="">Select Target Subject Registry</option>
                    {subjects.map(s => (
                      <option key={s._id} value={s._id}>{s.name} ({s.facultyId?.name || 'Unassigned'})</option>
                    ))}
                  </select>
               </div>

               <button 
                 type="submit" 
                 className="btn-nexus w-full !py-6 flex items-center justify-center gap-4 group"
               >
                 Initialize Enrollment
                 <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
               </button>
            </form>

            <p className="text-[10px] text-center font-bold text-slate-400 uppercase tracking-tighter opacity-60">
              Note: Enrollment is immutable once committed to the registry.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
