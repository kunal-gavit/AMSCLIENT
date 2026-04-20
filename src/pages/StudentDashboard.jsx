import { useState, useEffect } from "react";
import useAuth from "../context/useAuth";
import SubjectCard from "../components/SubjectCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Calculator, X, Activity, BarChart2, CheckCircle2, AlertCircle, Zap, TrendingUp, Radar, BookOpen, ShieldCheck, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { studentApi } from "../services/api";

const SECTION_CONFIG = {
  hub: {
    title: "Intelligence Hub",
    subtitle: "Real-time attendance analysis & predictive academic insights powered by MITAOE NEXUS.",
  },
  analytics: {
    title: "My Analytics",
    subtitle: "Deep attendance performance analytics across all active domains.",
  },
  domains: {
    title: "Domain Registry",
    subtitle: "Subject registry, enrollment intelligence, and historical attendance logs.",
  },
};

const StudentDashboard = ({ section = "hub" }) => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [simSubject, setSimSubject] = useState(null);
  const [simValue, setSimValue] = useState(0);
  const [history, setHistory] = useState([]);
  const [simulatedPercent, setSimulatedPercent] = useState(0);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [dashboardRes, historyRes] = await Promise.all([
          studentApi.getDashboard(),
          studentApi.getHistory(),
        ]);
        setAnalytics(dashboardRes.data?.subjectStats || []);
        setHistory(historyRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [user?._id]);

  const totalAttended = analytics.reduce((acc, curr) => acc + curr.attended, 0);
  const totalClasses = analytics.reduce((acc, curr) => acc + curr.total, 0);
  const aggregatePercent = totalClasses === 0 ? 0 : ((totalAttended / totalClasses) * 100).toFixed(1);
  const activeSection = SECTION_CONFIG[section] ? section : "hub";
  const sectionMeta = SECTION_CONFIG[activeSection];
  const showHub = activeSection === "hub";
  const showAnalytics = activeSection === "analytics";
  const showDomains = activeSection === "domains";

  const stats = [
    { label: "Sync Status", value: "Locked", icon: Activity, color: "text-emerald-500", detail: "Nexus Core v2.0" },
    { label: "Academic Velocity", value: `${aggregatePercent}%`, icon: Zap, color: "text-primary", detail: "Real-time stream" },
    { label: "Subject Registry", value: `${analytics.length}`, icon: BookOpen, color: "text-indigo-500", detail: "Active domains" },
    { label: "Alert Latency", value: "0ms", icon: ShieldCheck, color: "text-slate-900", detail: "Secure protocol" },
  ];

  const handleSimulate = (subject) => {
    setSimSubject(subject);
    setSimValue(0);
    setSimulatedPercent(subject.percentage || 0);
  };

  const getSimulatedPercent = () => {
    if (!simSubject) return 0;
    return Number(simulatedPercent || 0).toFixed(1);
  };

  useEffect(() => {
    const runSimulation = async () => {
      if (!simSubject) return;
      try {
        const matched = analytics.find((item) => item.subject === simSubject.subject);
        if (!matched?.subjectId) return;
        const { data } = await studentApi.simulate({
          subjectId: matched.subjectId,
          futureClasses: Number(simValue),
          expectedPresenceRate: 1,
        });
        setSimulatedPercent(data?.simulation?.predictedPercentage ?? simSubject.percentage ?? 0);
      } catch (err) {
        console.error(err);
      }
    };

    runSimulation();
  }, [simSubject, simValue, user?._id, analytics]);

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-[60vh] space-y-6">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="text-primary animate-pulse" size={24} />
        </div>
      </div>
      <p className="font-black text-xs uppercase tracking-[0.4em] text-slate-400 animate-pulse">Syncing Intelligence</p>
    </div>
  );



  return (
    <div className="space-y-16 pb-20">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full text-primary border border-primary/20">
            <Radar size={14} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Operational Nexus Active</span>
          </div>
          <h2 className="text-6xl font-black text-slate-800 tracking-tighter">{sectionMeta.title}</h2>
          <p className="text-slate-500 text-xl font-medium max-w-xl text-balance">{sectionMeta.subtitle}</p>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-premium p-8 flex items-center gap-10 relative overflow-hidden group shadow-massive shadow-primary/30"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/30 transition-all duration-1000" />
          <div className="text-right z-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Aggregate Velocity</p>
            <p className="text-5xl font-black text-primary tracking-tighter">
              {aggregatePercent}%
            </p>
          </div>
          <div className="h-16 w-px bg-slate-100 z-10" />
          <div className="p-5 bg-primary/10 rounded-[1.5rem] text-primary shadow-inner z-10 group-hover:scale-110 transition-transform duration-500">
            <TrendingUp size={32} />
          </div>
        </motion.div>
      </header>

      {/* Strategic Metrics Grid */}
      {(showHub || showAnalytics) && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, i) => (
            <div key={i} className="card-premium p-8 group relative overflow-hidden border-2 border-slate-50">
              <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-primary/5 transition-all duration-700" />
              <div className="flex items-center gap-6 relative z-10">
                <div className={`p-4 rounded-2xl bg-white shadow-massive shadow-slate-200/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  <stat.icon size={24} className={stat.color} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">{stat.label}</p>
                  <h4 className="text-3xl font-black text-slate-800 tracking-tighter">{stat.value}</h4>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter opacity-50">{stat.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        <div className="xl:col-span-8 space-y-16">
          {(showHub || showAnalytics) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-premium p-10 lg:p-12"
          >
            <div className="flex justify-between items-center mb-12">
                <h3 className="text-2xl font-black flex items-center gap-4">
                  <div className="p-3 bg-slate-900 rounded-2xl text-white">
                    <BarChart2 size={24} />
                  </div>
                  Subject Velocity Matrix
                </h3>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Optimal</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-danger rounded-full"></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">At Risk</span>
                    </div>
                </div>
            </div>

            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="subject" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} 
                    interval={0}
                    height={60}
                    className="uppercase tracking-widest"
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} domain={[0, 100]} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc', radius: 10}}
                    contentStyle={{borderRadius: '2rem', border: 'none', boxShadow: 'var(--shadow-premium)', padding: '24px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)'}}
                  />
                  <Bar dataKey="percentage" radius={[15, 15, 5, 5]} barSize={50} animationDuration={1500}>
                    {analytics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.percentage < 75 ? '#ff4d4d' : '#7c3aed'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
          )}

          {showDomains && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-premium p-10 lg:p-12"
            >
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black flex items-center gap-4 text-slate-800 tracking-tight">
                  <div className="p-3 bg-slate-900 rounded-2xl text-white">
                    <BookOpen size={22} />
                  </div>
                  Domain Registry List
                </h3>
                <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{analytics.length} Subjects</span>
                </div>
              </div>

              {analytics.length > 0 ? (
                <div className="overflow-x-auto rounded-3xl border border-slate-100 bg-white">
                  <table className="w-full min-w-[720px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Subject</th>
                        <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Code</th>
                        <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Attended / Total</th>
                        <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Percentage</th>
                        <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.map((item, idx) => (
                        <tr key={`${item.subject}-${item.subjectId || idx}`} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60 transition-colors">
                          <td className="px-6 py-5">
                            <p className="font-black text-slate-800 tracking-tight">{item.subject}</p>
                          </td>
                          <td className="px-6 py-5">
                            <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-[0.18em]">
                              {item.code || "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-sm font-black text-slate-700 tabular-nums">
                            {item.attended} / {item.total}
                          </td>
                          <td className="px-6 py-5 text-sm font-black text-primary tabular-nums">
                            {Number(item.percentage || 0).toFixed(1)}%
                          </td>
                          <td className="px-6 py-5">
                            <span
                              className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.16em] border ${
                                item.status === "Safe"
                                  ? "bg-success/10 text-success border-success/20"
                                  : item.status === "Warning"
                                    ? "bg-amber-100 text-amber-700 border-amber-200"
                                    : "bg-danger/10 text-danger border-danger/20"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-16 text-center rounded-3xl border-2 border-dashed border-slate-100 bg-slate-50/40">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No Subjects Found In Domain Registry</p>
                </div>
              )}
            </motion.div>
          )}

          {(showHub || showAnalytics || showDomains) && (
          <div className="space-y-12">
            <h3 className="text-3xl font-black text-slate-800 tracking-tighter flex items-center gap-4">
              Subject Overview
              <div className="h-1 w-20 bg-slate-100 rounded-full" />
            </h3>
            
            {analytics.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {analytics.map((data, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <SubjectCard data={data} onSimulate={handleSimulate} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-premium p-20 text-center space-y-8 bg-slate-50/50 border-dashed border-2"
              >
                <div className="w-24 h-24 bg-white rounded-3xl shadow-massive flex items-center justify-center mx-auto text-slate-300">
                  <BookOpen size={48} />
                </div>
                <div className="space-y-3">
                  <h4 className="text-2xl font-black text-slate-800 tracking-tighter">Academic Registry Empty</h4>
                  <p className="text-slate-500 max-w-sm mx-auto font-medium">Your operational curriculum is currently being synced. Contact administration if this persists for more than 24 cycles.</p>
                </div>
                <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-transform">
                  Manual Profile Sync
                </button>
              </motion.div>
            )}
          </div>
          )}
        </div>

        <div className="xl:col-span-4 space-y-12">
          {(showHub || showAnalytics) && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-premium relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32" />
            <h3 className="text-2xl font-black mb-10 flex items-center gap-4 relative z-10 text-primary-light">
              <Calculator size={28} />
              Quick Synthetics
            </h3>
            <div className="space-y-6 relative z-10">
              {[
                { label: "High Exposure Units", value: analytics.filter(a => a.percentage < 75).length, color: "text-danger", icon: AlertCircle },
                { label: "Temporal Sessions", value: analytics.reduce((acc, curr) => acc + curr.total, 0), color: "text-white", icon: Activity },
                { label: "Growth Trajectories", value: `${analytics.filter(a => a.trend === "Improving").length} Positive`, color: "text-success", icon: TrendingUp },
                { label: "Historical Records", value: `${history.length} Rec.`, color: "text-indigo-400", icon: Layers }
              ].map((stat, i) => (
                <div key={i} className="flex justify-between items-center bg-white/10 p-6 rounded-[2rem] border border-white/5 backdrop-blur-md group hover:bg-white/20 transition-all duration-500">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-xl">
                        <stat.icon size={18} className={stat.color} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">{stat.label}</span>
                  </div>
                  <span className={`text-2xl font-black ${stat.color} tabular-nums`}>
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-10 p-6 bg-primary/20 rounded-2xl border border-primary/20 relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-80">Security Protocol</p>
                <p className="text-xs font-bold leading-relaxed opacity-60">Maintain &gt;75% velocity to ensure valid academic standing and system access.</p>
            </div>
          </motion.div>
          )}

          {(showHub || showAnalytics) && (
          <AnimatePresence>
            {simSubject && (
              <motion.div 
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.9 }}
                className="card-premium p-10 lg:p-12 border-2 border-primary/20 sticky top-12"
              >
                <div className="flex justify-between items-center mb-10">
                  <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                    <Calculator size={24} />
                  </div>
                  <button onClick={() => setSimSubject(null)} className="p-3 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100">
                    <X size={20} className="text-slate-400" />
                  </button>
                </div>
                
                <div className="mb-12">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Simulation Target</p>
                  <p className="text-2xl font-black text-slate-800 mb-8 tracking-tight">{simSubject.subject}</p>
                  
                  <div className="flex justify-between items-end mb-6">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Future Credits</label>
                    <span className="text-3xl font-black text-primary tracking-tighter">+{simValue} <span className="text-xs opacity-50 font-black">UNITS</span></span>
                  </div>
                  
                  <div className="relative h-4 mb-4">
                    <input 
                        type="range" min="0" max="25" step="1"
                        className="absolute inset-0 w-full h-full bg-slate-100 rounded-full appearance-none cursor-pointer accent-primary border border-slate-100 z-10"
                        value={simValue}
                        onChange={(e) => setSimValue(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-between px-1">
                      <span className="text-[9px] font-black text-slate-300">MIN</span>
                      <span className="text-[9px] font-black text-slate-300">MAX CAPACITY</span>
                  </div>
                </div>

                <motion.div 
                    layout
                    className="bg-slate-50/50 p-10 rounded-[2.5rem] border border-slate-100 relative overflow-hidden group"
                >
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-[60px]" />
                  <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Projected Velocity</p>
                  <h4 className="text-center text-6xl font-black text-primary tracking-tighter z-10 relative">
                    {getSimulatedPercent()}%
                  </h4>
                  <div className="mt-10 flex justify-center z-10 relative">
                    {getSimulatedPercent() >= 75 ? (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-3 px-6 py-3 bg-success/10 text-success rounded-full border border-success/20 shadow-lg shadow-success/5"
                      >
                        <CheckCircle2 size={18} />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">Criteria Satisfied</span>
                      </motion.div>
                    ) : (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-3 px-6 py-3 bg-danger/10 text-danger rounded-full border border-danger/20 shadow-lg shadow-danger/5"
                      >
                        <AlertCircle size={18} />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">Gap Identified</span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          )}

          {(showHub || showDomains) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="card-premium p-10 space-y-8 mt-12 bg-white/80 backdrop-blur-xl border border-slate-100"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-800 tracking-tighter flex items-center gap-4">
                <div className="p-3 bg-slate-900 text-white rounded-xl">
                  <Activity size={20} />
                </div>
                Temporal Logs
              </h3>
              <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Session History</span>
              </div>
            </div>

            <div className="space-y-4">
              {history.length > 0 ? history.map((log) => (
                <div key={log._id} className="flex justify-between items-center p-5 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:bg-white hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                  <div className="flex items-center gap-5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-all duration-300 ${
                      log.status === "Present" 
                      ? 'bg-success/10 text-success group-hover:bg-success group-hover:text-white' 
                      : 'bg-danger/10 text-danger group-hover:bg-danger group-hover:text-white'
                    }`}>
                      {log.status === "Present" ? "P" : "A"}
                    </div>
                    <div>
                      <p className="font-black text-slate-800 tracking-tight leading-none mb-1 text-sm">{log.subject}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">
                        {new Date(log.date).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })} • {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                    log.status === "Present" 
                    ? 'bg-success/5 text-success border-success/10' 
                    : 'bg-danger/5 text-danger border-danger/10'
                  }`}>
                    {log.status}
                  </div>
                </div>
              )) : (
                <div className="py-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                    <Activity size={32} />
                  </div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No Temporal Pulse Detected</p>
                </div>
              )}
            </div>
            
            <button className="w-full py-5 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-primary transition-colors border-2 border-dashed border-slate-100 rounded-2xl hover:border-primary/20">
              Download Full Protocol JSON
            </button>
          </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
