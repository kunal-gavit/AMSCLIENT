import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../context/useAuth";
import { UserPlus, Mail, Lock, User, Briefcase, Hash, AlertCircle, ChevronRight, BookOpen, GraduationCap, Layers } from "lucide-react";
import { motion } from "framer-motion";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    branch: "CSE",
    year: "TE",
    division: "A",
    rollNo: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(formData);
      navigate("/");
    } catch (err) {
      const backendErrors = err.response?.data?.errors;
      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        setError(backendErrors[0].message || "Registration failed");
      } else {
        setError(err.response?.data?.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-6 bg-slate-50/50 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-white rounded-[3rem] shadow-premium border border-slate-100 p-12 md:p-16"
      >
        <div className="text-center mb-16">
          <div className="inline-flex p-5 bg-primary/10 rounded-[1.5rem] text-primary mb-8 shadow-sm">
            <UserPlus size={32} />
          </div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter mb-4">Create System Dossier</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Enrollment into the Academic Intelligence Collective</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-10 p-6 bg-danger/5 border border-danger/10 rounded-2xl flex items-center gap-4 text-danger text-sm font-black uppercase tracking-wider"
          >
            <AlertCircle size={20} />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Full Identity</label>
            <div className="relative group">
              <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
              <input type="text" name="name" required className="input-nexus pl-16" placeholder="Agent Name" value={formData.name} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Institutional Email</label>
            <div className="relative group">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
              <input type="email" name="email" required className="input-nexus pl-16 placeholder:tracking-[0.1em] placeholder:font-black placeholder:text-[10px] placeholder:uppercase" placeholder="Identifier" value={formData.email} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Access Key</label>
            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
              <input type="password" name="password" required className="input-nexus pl-16" placeholder="••••••••" value={formData.password} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">System Role</label>
            <div className="relative group">
              <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
              <select name="role" className="input-nexus pl-16 appearance-none cursor-pointer" value={formData.role} onChange={handleChange}>
                <option value="student">Student</option>
                <option value="teacher">Faculty</option>
              </select>
            </div>
          </div>

          {formData.role === "student" && (
            <>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Roll Identification</label>
                <div className="relative group">
                  <Hash className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                  <input type="text" name="rollNo" required className="input-nexus pl-16" placeholder="EG. 123" value={formData.rollNo} onChange={handleChange} />
                </div>
              </div>
              <div className="space-y-8">
                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 ml-2">Academic Branch</label>
                  <div className="relative group">
                    <BookOpen className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                    <select 
                      name="branch" 
                      className="input-nexus pl-16 appearance-none cursor-pointer pr-12 text-sm" 
                      value={formData.branch} 
                      onChange={handleChange}
                    >
                      <option value="CSE">Computer Science</option>
                      <option value="DS">Data Science</option>
                      <option value="AIML">AI & Machine Learning</option>
                      <option value="IT">Information Tech</option>
                      <option value="ECE">Electronics (ECE)</option>
                      <option value="SF">Software Eng</option>
                      <option value="ENTC">Electronics (ENTC)</option>
                      <option value="CIVIL">Civil Eng</option>
                      <option value="MECH">Mechanical Eng</option>
                      <option value="CHEM">Chemical Eng</option>
                    </select>
                    <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-all rotate-90 pointer-events-none" size={16} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 ml-2">Classification Year</label>
                    <div className="relative group">
                      <GraduationCap className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                      <select 
                        name="year" 
                        className="input-nexus pl-16 appearance-none cursor-pointer pr-12 text-sm" 
                        value={formData.year} 
                        onChange={handleChange}
                      >
                        <option value="FE">First Year</option>
                        <option value="SE">Second Year</option>
                        <option value="TE">Third Year</option>
                        <option value="BE">Final Year</option>
                      </select>
                      <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-all rotate-90 pointer-events-none" size={16} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 ml-2">Division Unit</label>
                    <div className="relative group">
                      <Layers className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                      <input 
                        type="text"
                        name="division" 
                        required
                        maxLength="2"
                        className="input-nexus pl-16 text-sm uppercase" 
                        placeholder="EG. A"
                        value={formData.division} 
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="col-span-1 md:col-span-2 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="btn-nexus w-full"
            >
              {loading ? "Transmitting..." : "Initialize Registration"}
            </button>
          </div>
        </form>

        <div className="mt-12 pt-12 border-t border-slate-50 text-center">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
            Already authenticated?{" "}
            <Link to="/login" className="text-primary hover:underline ml-2">
              Back to Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
