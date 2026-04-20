import { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { BookOpen, ShieldCheck, AlertTriangle, TrendingUp } from "lucide-react";
import AppNavbar from "../components/ui/AppNavbar";
import DashboardCard from "../components/ui/DashboardCard";
import AppButton from "../components/ui/AppButton";
import DataTable from "../components/ui/DataTable";
import FormField from "../components/ui/FormField";

const subjects = [
  { id: "1", subject: "Data Structures", code: "CS201", attendance: 92, status: "safe", statusLabel: "Safe" },
  { id: "2", subject: "Operating Systems", code: "CS301", attendance: 78, status: "warning", statusLabel: "Warning" },
  { id: "3", subject: "Database Systems", code: "CS304", attendance: 68, status: "risk", statusLabel: "At Risk" },
  { id: "4", subject: "Computer Networks", code: "CS307", attendance: 88, status: "safe", statusLabel: "Safe" },
];

const statusColor = {
  safe: "#16A34A",
  warning: "#F59E0B",
  risk: "#DC2626",
};

const DesignSystemDemo = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredSubjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return subjects;
    return subjects.filter((item) => item.subject.toLowerCase().includes(query) || item.code.toLowerCase().includes(query));
  }, [search]);

  const cards = [
    { title: "Overall Attendance", value: "81.5%", subtitle: "Current semester", status: "primary", icon: TrendingUp },
    { title: "Safe Subjects", value: "2", subtitle: "Above 85%", status: "safe", icon: ShieldCheck },
    { title: "Warning Subjects", value: "1", subtitle: "Between 75% and 85%", status: "warning", icon: AlertTriangle },
    { title: "At Risk Subjects", value: "1", subtitle: "Below 75%", status: "risk", icon: BookOpen },
  ];

  return (
    <div className="app-shell">
      <AppNavbar
        title="MITAOE Smart Attendance & Academic Intelligence System"
        user={{ name: "Kunal Student", role: "Student" }}
        onMenuToggle={() => setMobileMenuOpen((prev) => !prev)}
      />

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
          <aside className={`${mobileMenuOpen ? "block" : "hidden"} md:block`}>
            <div className="card-academic">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Navigation</p>
              <nav className="mt-4 space-y-2 text-sm">
                <a href="#" className="block rounded-lg bg-primary/10 px-3 py-2 font-semibold text-primary">Dashboard</a>
                <a href="#" className="block rounded-lg px-3 py-2 text-gray-500 hover:bg-slate-100">Analytics</a>
                <a href="#" className="block rounded-lg px-3 py-2 text-gray-500 hover:bg-slate-100">Domain Registry</a>
              </nav>
            </div>
          </aside>

          <main className="space-y-6">
            <section className="dashboard-grid">
              {cards.map((card) => (
                <DashboardCard
                  key={card.title}
                  title={card.title}
                  value={card.value}
                  subtitle={card.subtitle}
                  status={card.status}
                  icon={card.icon}
                />
              ))}
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_1fr]">
              <div className="card-academic">
                <h2 className="text-lg font-bold text-gray-900">Subject Attendance Distribution</h2>
                <p className="mt-1 text-sm text-gray-500">Blue: Primary data, Green: Safe, Yellow: Warning, Red: Risk</p>
                <div className="mt-6 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={subjects}>
                      <XAxis dataKey="code" tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Bar dataKey="attendance" radius={[8, 8, 0, 0]}>
                        {subjects.map((entry) => (
                          <Cell key={entry.id} fill={statusColor[entry.status] || "#0A2A66"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card-academic space-y-4">
                <h2 className="text-lg font-bold text-gray-900">Search Domain</h2>
                <FormField
                  id="subject-search"
                  label="Subject Name or Code"
                  placeholder="e.g. CS301"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="flex flex-wrap gap-3 pt-1">
                  <AppButton variant="primary">Apply Filter</AppButton>
                  <AppButton variant="secondary" onClick={() => setSearch("")}>Reset</AppButton>
                  <AppButton variant="danger">Flag Risk</AppButton>
                </div>
              </div>
            </section>

            <section>
              <DataTable rows={filteredSubjects} />
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DesignSystemDemo;
