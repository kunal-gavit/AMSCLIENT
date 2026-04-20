import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { GraduationCap, BarChart2, ShieldCheck, Zap, ArrowRight, CheckCircle2, Globe, Cpu, Lock, Terminal, ChevronRight } from "lucide-react";
import { useRef } from "react";

const Landing = () => {
  const navigate = useNavigate();
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

  return (
    <div className="min-h-screen bg-white selection:bg-primary selection:text-white overflow-x-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[160px]" />
      </div>

      {/* Hero Section */}
      <section ref={targetRef} className="relative min-h-screen flex items-center justify-center pt-20 pb-32 overflow-hidden z-10">
        <motion.div 
            style={{ opacity, scale, y }}
            className="max-w-7xl mx-auto px-6 text-center space-y-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-4 px-8 py-3 rounded-full bg-slate-900 border border-white/10 text-white shadow-2xl"
          >
            <div className="p-1.5 bg-primary rounded-full">
                <Zap size={14} className="fill-white" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">System Status: Operational</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </motion.div>

          <motion.div className="space-y-6">
            <motion.h1 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-7xl md:text-9xl font-black text-slate-800 leading-none tracking-tighter"
            >
                Academic <br />
                <span className="relative inline-block">
                    Intelligence.
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 1, duration: 1 }}
                        className="absolute bottom-4 left-0 h-4 bg-primary/20 -z-10"
                    />
                </span>
            </motion.h1>

            <motion.p 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="max-w-3xl mx-auto text-xl md:text-3xl text-slate-500 font-medium leading-tight tracking-tight px-4"
            >
                The industrial-grade ecosystem for predictive attendance management and strategic institutional oversight.
            </motion.p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-8"
          >
            <button 
              onClick={() => navigate("/login")}
              className="btn-nexus !px-16 !py-8 !text-lg !rounded-[2.5rem] shadow-massive group"
            >
              <span className="flex items-center gap-3">
                Establish Neural Bridge
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button 
              onClick={() => navigate("/register")}
              className="px-16 py-8 bg-white hover:bg-slate-50 text-slate-800 font-black text-lg uppercase tracking-widest rounded-[2.5rem] border-2 border-slate-100 transition-all duration-500 hover:scale-105 active:scale-95 shadow-xl"
            >
              Identity Registry
            </button>
          </motion.div>
        </motion.div>
        
        {/* Floating Decoration */}
        <motion.div 
            animate={{ 
                y: [0, -20, 0],
                rotate: [0, 5, 0]
            }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 opacity-20 pointer-events-none"
        >
            <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1.5 h-16 bg-slate-200 rounded-full" />)}
            </div>
        </motion.div>
      </section>

      {/* Feature Architecture */}
      <section className="py-48 bg-slate-900 border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.1),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div className="space-y-12">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/20 rounded-xl text-primary-light border border-primary/20">
                    <Cpu size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Protocol Intelligence</span>
                </div>
                <h2 className="text-6xl font-black text-white tracking-tighter leading-none">Command & Control Dashboard.</h2>
                <p className="text-xl text-slate-400 font-medium leading-relaxed">
                  Engineered with biometric precision. Nexus provides a 360-degree tactical overview of your entire academic trajectory.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { icon: BarChart2, label: "Trend Analysis", color: "text-primary" },
                  { icon: ShieldCheck, label: "Vault Security", color: "text-indigo-400" },
                  { icon: Globe, label: "Global Sync", color: "text-emerald-400" },
                  { icon: Terminal, label: "Logic API", color: "text-amber-400" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-5 p-6 rounded-[2rem] bg-white/5 border border-white/5 group hover:bg-white/10 transition-all duration-300">
                    <div className={`${item.color} p-3 bg-current/10 rounded-2xl group-hover:scale-110 transition-transform`}>
                        <item.icon size={24} />
                    </div>
                    <span className="text-white font-black uppercase tracking-widest text-xs">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative group">
                <div className="absolute -inset-10 bg-primary/30 rounded-full blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <motion.div 
                    initial={{ rotate: 10, scale: 0.9, opacity: 0 }}
                    whileInView={{ rotate: -5, scale: 1, opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="relative bg-slate-800 p-3 rounded-[4rem] shadow-massive border-[12px] border-slate-700/50"
                >
                    <img 
                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop" 
                        alt="Nexus Interface" 
                        className="rounded-[3.5rem] grayscale group-hover:grayscale-0 transition-all duration-1000"
                    />
                </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Metrics Section */}
      <section className="py-64 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center space-y-8 mb-32">
                <h3 className="text-5xl font-black text-slate-800 tracking-tighter">Engineered for Transparency.</h3>
                <p className="max-w-2xl mx-auto text-xl text-slate-500 font-medium">Nexus core metrics are calculated using real-time institutional biometric audits, ensuring 100% data integrity.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                {[
                  { value: "75%", label: "Biometric Threshold", sub: "Institutional Criteria" },
                  { value: "0ms", label: "Sync Latency", sub: "Real-time Telemetry" },
                  { value: "SQL-M", label: "Logic Engine", sub: "Proprietary Architecture" }
                ].map((stat, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-12 rounded-[4rem] bg-slate-50 border border-slate-100 shadow-premium"
                  >
                    <h4 className="text-7xl font-black text-primary tracking-tighter mb-4">{stat.value}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">{stat.label}</p>
                    <p className="text-sm font-bold text-slate-800 opacity-60 uppercase tracking-widest">{stat.sub}</p>
                  </motion.div>
                ))}
           </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-48 px-6">
        <motion.div 
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto bg-slate-900 rounded-[5rem] p-20 md:p-32 text-center text-white relative overflow-hidden"
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.4),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(79,70,229,0.3),transparent_50%)]" />
            
            <div className="relative z-10 space-y-16">
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
                    Ready to initiate <br /> 
                    Nexus Uplink?
                </h2>
                <div className="flex flex-col sm:flex-row justify-center gap-8">
                    <button onClick={() => navigate("/login")} className="btn-nexus !px-16 !py-8 !text-lg !rounded-full shadow-massive">Get Early Access</button>
                    <button className="px-16 py-8 bg-white/5 hover:bg-white/10 text-white font-black text-lg uppercase tracking-widest rounded-full border-2 border-white/10 backdrop-blur-xl transition-all">Documentation</button>
                </div>
            </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-24 bg-white border-t border-slate-100 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-16">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-slate-900 p-3 rounded-2xl">
                    <Zap size={24} className="text-primary fill-white" />
                </div>
                <p className="text-3xl font-black tracking-tighter text-slate-800">NEXUS CORE</p>
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Academic Intelligence Collective &bull; Institutional Control</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-16">
                {['Security', 'Privacy', 'Compliance', 'Ethics'].map(item => (
                    <div key={item} className="space-y-4">
                        <p className="text-slate-900 font-black text-xs uppercase tracking-widest">{item}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest cursor-pointer hover:text-primary transition-colors">Architecture</p>
                    </div>
                ))}
            </div>
          </div>
          <div className="mt-24 pt-12 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-8">
            <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.4em]">&copy; 2026 NEXUS ARCHITECTURE. ENCRYPTED.</p>
            <div className="flex gap-12 font-black text-[10px] uppercase tracking-widest text-slate-400">
                <span className="cursor-pointer hover:text-primary">Twitter</span>
                <span className="cursor-pointer hover:text-primary">LinkedIn</span>
                <span className="cursor-pointer hover:text-primary">GitHub</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
