import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import useAuth from "./context/useAuth";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import DesignSystemDemo from "./pages/DesignSystemDemo";
import ProfilePage from "./pages/ProfilePage";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-screen bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#7c3aed10,transparent_50%)]" />
      <div className="relative">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse" />
      </div>
      <p className="mt-8 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">Syncing Nexus Core...</p>
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;

  return children;
};

function AppContent() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return (
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/design-system" element={<DesignSystemDemo />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  return (
    <div className="flex bg-[#fdfdff] min-h-screen font-sans selection:bg-primary/10 selection:text-primary">
      <Sidebar />
      <main className="flex-1 min-h-screen relative overflow-x-hidden">
        <Navbar />
        {/* Subtle Ambient Background */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-[120px] -mr-40 -mt-40" />
          <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-indigo-500/5 rounded-full blur-[120px] -ml-40 -mb-40" />
        </div>

        <div className="p-10 lg:p-16 max-w-[1600px] mx-auto">
          <AnimatePresence mode="wait">
            <div
              key={location.pathname}
            >
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Navigate to={`/${user.role}`} />} />
                <Route 
                  path="/student" 
                  element={<Navigate to="/student/hub" replace />} 
                />
                <Route 
                  path="/student/hub" 
                  element={
                    <ProtectedRoute role="student">
                      <StudentDashboard section="hub" />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/student/analytics" 
                  element={
                    <ProtectedRoute role="student">
                      <StudentDashboard section="analytics" />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/student/domains" 
                  element={
                    <ProtectedRoute role="student">
                      <StudentDashboard section="domains" />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/teacher" 
                  element={
                    <ProtectedRoute role="teacher">
                      <TeacherDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/teacher/control" 
                  element={
                    <ProtectedRoute role="teacher">
                      <TeacherDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/teacher/reports" 
                  element={
                    <ProtectedRoute role="teacher">
                      <TeacherDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute role="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/design-system" element={<DesignSystemDemo />} />
                <Route path="*" element={<Navigate to={`/${user.role}`} />} />
              </Routes>
            </div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
