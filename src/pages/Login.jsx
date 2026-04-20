import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../context/useAuth";
import { LogIn, Mail, Lock, AlertCircle } from "lucide-react";
import { AnimatePresence } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50/50">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-500/10 rounded-full blur-[100px]" />
      </div>

      <div 
        className="w-full max-w-xl bg-white rounded-[3rem] shadow-premium border border-slate-100 p-12 md:p-16"
      >
        <div className="text-center mb-12">
          <div className="inline-flex p-5 bg-primary rounded-[1.5rem] text-white shadow-xl shadow-primary/20 mb-8">
            <LogIn size={32} />
          </div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter mb-4">Identity Verification</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Security Gateway Protocol Active</p>
        </div>

        <AnimatePresence>
          {error && (
            <div className="mb-8 p-6 bg-danger/5 border border-danger/10 rounded-2xl flex items-center gap-4 text-danger text-sm font-black uppercase tracking-wider">
              <AlertCircle size={20} />
              {error}
            </div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Institutional Email</label>
            <div className="relative group">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
              <input
                type="email"
                required
                className="input-nexus pl-16 placeholder:tracking-[0.1em] placeholder:font-black placeholder:text-[10px] placeholder:uppercase"
                placeholder="Institutional Identifier"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Access Key</label>
            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
              <input
                type="password"
                required
                className="input-nexus pl-16"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-nexus w-full"
          >
            {loading ? "Decrypting..." : "Initialize Access"}
          </button>
        </form>

        <div className="mt-12 pt-12 border-t border-slate-50 text-center">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
            {" "}
            <Link to="/register" className="text-primary hover:underline ml-2">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
