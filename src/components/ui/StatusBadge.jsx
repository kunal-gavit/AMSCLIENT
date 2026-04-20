const statusClass = {
  safe: "badge-safe",
  warning: "badge-warning",
  risk: "badge-risk",
};

const StatusBadge = ({ status = "safe", label }) => {
  return <span className={statusClass[status] || statusClass.safe}>{label || status}</span>;
};

export default StatusBadge;
