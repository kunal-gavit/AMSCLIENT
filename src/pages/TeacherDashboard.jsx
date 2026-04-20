import { useState, useEffect, useCallback } from "react";
import { Users, AlertCircle, CheckCircle2, TrendingUp, Search, Calendar, ChevronRight, Activity, ShieldCheck, Zap, Layers, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { teacherApi } from "../services/api";

const TeacherDashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [students, setStudents] = useState([]);
  const [markingDate, setMarkingDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [atRiskStudents, setAtRiskStudents] = useState([]);
  const [lectureStats, setLectureStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async (subjectId) => {
    if (!subjectId) return;
    try {
      const { data } = await teacherApi.getAnalytics(subjectId);
      setAnalytics(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchStudents = useCallback(async (subjectId) => {
    if (!subjectId) return;
    try {
      const { data } = await teacherApi.getStudents(subjectId);
      setStudents(data);
      setAttendanceData(data.map(s => ({ id: s._id, status: "Present" })));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchAtRisk = useCallback(async (subjectId) => {
    if (!subjectId) return;
    try {
      const { data } = await teacherApi.getAtRisk(subjectId);
      setAtRiskStudents(data?.students || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchLectureStats = useCallback(async (subjectId) => {
    if (!subjectId) return;
    try {
      const { data } = await teacherApi.getLectures(subjectId);
      setLectureStats(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data } = await teacherApi.getSubjects();
        setSubjects(data);
        if (data.length > 0) {
          const firstSubjectId = data[0]._id;
          setSelectedSubject(firstSubjectId);
          await Promise.all([
            fetchAnalytics(firstSubjectId),
            fetchStudents(firstSubjectId),
            fetchAtRisk(firstSubjectId),
            fetchLectureStats(firstSubjectId),
          ]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [fetchAnalytics, fetchStudents, fetchAtRisk, fetchLectureStats]);

  const handleSubjectChange = async (subjectId) => {
    setSelectedSubject(subjectId);
    await Promise.all([
      fetchAnalytics(subjectId),
      fetchStudents(subjectId),
      fetchAtRisk(subjectId),
      fetchLectureStats(subjectId),
    ]);
  };

  const toggleAttendance = (id) => {
    setAttendanceData(prev => prev.map(item => 
      item.id === id ? { ...item, status: item.status === "Present" ? "Absent" : "Present" } : item
    ));
  };

  const submitAttendance = async () => {
    try {
      await teacherApi.markAttendance({ 
        subjectId: selectedSubject, 
        date: markingDate, 
        students: attendanceData 
      });
      alert("Intelligence update committed!");
      await Promise.all([
        fetchAnalytics(selectedSubject),
        fetchAtRisk(selectedSubject),
        fetchLectureStats(selectedSubject),
      ]);
    } catch (err) {
      console.error(err);
      alert("Failed to commit session records.");
    }
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-[60vh] space-y-6">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <ShieldCheck className="text-primary animate-pulse" size={28} />
        </div>
      </div>
      <p className="font-black text-xs uppercase tracking-[0.4em] text-slate-400 animate-pulse">Initializing Command Console</p>
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
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-900/5 rounded-full text-slate-600 border border-slate-200">
            <Layers size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Faculty Strategy Division</span>
          </div>
          <h2 className="text-6xl font-black text-slate-800 tracking-tighter">Faculty Command</h2>
          <p className="text-slate-500 text-xl font-medium max-w-2xl text-balance">Operational control and predictive oversight for student academic velocity and session integrity.</p>
        </motion.div>

        <div className="flex flex-col sm:flex-row items-center gap-6 w-full xl:w-auto">
            <div className="relative w-full sm:w-80 group">
                <Filter className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                <select 
                    className="input-nexus pl-16 appearance-none cursor-pointer bg-white"
                    value={selectedSubject}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                >
                  {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
                <ChevronRight size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" />
            </div>
        </div>
      </header>

      {/* Strategic Metrics */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {[
          { label: "Fleet Velocity", value: `${analytics?.classAverage || 0}%`, icon: TrendingUp, color: "bg-primary", shimmer: "from-primary" },
          { label: "Gap Frequency", value: analytics?.atRiskCount || 0, icon: AlertCircle, color: "bg-danger", shimmer: "from-danger" },
          { label: "Lecture Sessions", value: lectureStats.length, icon: ShieldCheck, color: "bg-success", shimmer: "from-success" },
          { label: "Active Entities", value: students.length, icon: Users, color: "bg-indigo-600", shimmer: "from-indigo-600" }
        ].map((stat, i) => (
          <div key={i} className="card-premium p-8 group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.shimmer} to-transparent opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-500 -mr-16 -mt-16 rounded-full blur-2xl`} />
            <div className="flex items-center gap-6 relative z-10">
              <div className={`p-4 rounded-[1.25rem] ${stat.color} text-white shadow-xl shadow-${stat.shimmer.split('-')[1]}/20 group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">{stat.label}</p>
                <h4 className="text-4xl font-black text-slate-800 tracking-tighter tabular-nums">{stat.value}</h4>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        <div className="xl:col-span-8 space-y-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-premium overflow-hidden"
          >
            <div className="p-10 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 bg-slate-50/30">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-white rounded-2xl shadow-premium border border-slate-100 text-primary group hover:rotate-12 transition-transform">
                  <Calendar size={28} />
                </div>
                <div>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-2">Session Registry</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mark Attendance for active deployment</p>
                </div>
              </div>
              <div className="relative group w-full sm:w-auto">
                <input 
                  type="date"
                  className="input-nexus px-8 py-4 bg-white font-black tracking-tight w-full sm:w-64"
                  value={markingDate}
                  onChange={(e) => setMarkingDate(e.target.value)}
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 uppercase text-[10px] font-black tracking-[0.2em] text-slate-400 border-b border-slate-50">
                  <tr>
                    <th className="px-10 py-8">Personnel Information</th>
                    <th className="px-10 py-8">Designation Code</th>
                    <th className="px-10 py-8 text-center">Status Protocol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {students.map((student) => (
                    <tr key={student._id} className="group hover:bg-slate-50/80 transition-all">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center font-black text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-300">
                            {student.name[0]}
                          </div>
                          <div>
                            <p className="font-black text-slate-800 tracking-tight text-lg leading-none mb-1 group-hover:translate-x-1 transition-transform">{student.name}</p>
                            <p className="text-xs text-slate-400 font-bold tracking-tight opacity-60 italic">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                          <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-xl">
                            <span className="w-2 h-2 bg-slate-300 rounded-full"></span>
                            <span className="text-xs font-black text-slate-500 tracking-widest uppercase">ID:{student._id.slice(-6).toUpperCase()}</span>
                          </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex justify-center">
                          <button 
                            onClick={() => toggleAttendance(student._id)}
                            className={`w-40 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 transform active:scale-90 ${
                              attendanceData.find(a => a.id === student._id)?.status === "Present"
                              ? 'bg-success text-white shadow-xl shadow-success/20 ring-4 ring-success/10'
                              : 'bg-danger text-white shadow-xl shadow-danger/20 ring-4 ring-danger/10'
                            }`}
                          >
                            {attendanceData.find(a => a.id === student._id)?.status}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-10 bg-slate-50/50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={submitAttendance}
                className="btn-nexus w-full sm:w-auto px-12 py-6 flex items-center justify-center gap-4 group"
              >
                <Zap size={20} className="group-hover:text-yellow-400 transition-colors" />
                Commit Session Records
                <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>

        <div className="xl:col-span-4 space-y-12">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card-premium p-10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-danger/5 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-2xl font-black flex items-center gap-4 text-slate-800 tracking-tight">
                Watchlist
              </h3>
              <div className="p-3 bg-danger/10 text-danger rounded-2xl">
                <AlertCircle size={24} />
              </div>
            </div>
            
            <div className="space-y-6">
              {atRiskStudents.length === 0 ? (
                <div className="text-center py-10 opacity-30">
                    <ShieldCheck size={48} className="mx-auto mb-4" />
                    <p className="font-black text-[10px] uppercase tracking-widest">No Gap Detected</p>
                </div>
              ) : (
                atRiskStudents.map(s => (
                  <motion.div 
                    key={s.studentId} 
                    whileHover={{ x: 5 }}
                    className="p-8 rounded-[2.5rem] bg-danger/5 border border-danger/10 flex justify-between items-center group hover:bg-danger/10 shadow-sm transition-all duration-300"
                  >
                    <div>
                      <p className="font-black text-slate-800 text-lg leading-tight mb-1">{s.name}</p>
                      <div className="flex items-center gap-2">
                        <Activity size={12} className="text-danger" />
                        <p className="text-[10px] text-danger font-black uppercase tracking-[0.2em] opacity-80">CRITICAL VELOCITY</p>
                      </div>
                    </div>
                    <span className="text-4xl font-black text-danger tracking-tighter tabular-nums">{s.percentage}%</span>
                  </motion.div>
                ))
              )}
            </div>
            
            <button className="w-full mt-12 py-6 bg-white border-2 border-slate-100 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-500 shadow-sm">
              Initialize Outreach Protocol
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-indigo-600 p-10 rounded-[3.5rem] text-white shadow-premium relative overflow-hidden group"
          >
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-[100px] group-hover:bg-white/20 transition-colors duration-700" />
            <div className="relative z-10">
                <div className="p-4 bg-white/10 rounded-3xl w-fit mb-8 backdrop-blur-xl border border-white/10">
                    <Zap size={32} className="text-indigo-200" />
                </div>
                <h4 className="font-black text-3xl mb-6 tracking-tight leading-tight">AI Diagnostic Active</h4>
                <p className="text-indigo-100 text-lg font-medium leading-relaxed mb-10 opacity-70">
                  Predictive engines have identified potential academic bottlenecks in Unit 4 based on current metadata.
                </p>
                <button className="w-full py-5 bg-white text-indigo-600 font-black uppercase tracking-[0.3em] rounded-2xl text-[10px] hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-indigo-900/20">
                  Execute Diagnostic
                </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
