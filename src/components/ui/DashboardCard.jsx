const statusBorderClass = {
  primary: "card-status-primary",
  safe: "card-status-safe",
  warning: "card-status-warning",
  risk: "card-status-risk",
};

const DashboardCard = ({ title, value, subtitle, status = "primary", icon: Icon }) => {
  return (
    <article className={`card-academic ${statusBorderClass[status] || statusBorderClass.primary}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-500">{title}</p>
          <h3 className="mt-1 text-2xl font-bold text-gray-900">{value}</h3>
          {subtitle ? <p className="mt-1 text-xs text-gray-500">{subtitle}</p> : null}
        </div>
        {Icon ? (
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Icon size={18} />
          </div>
        ) : null}
      </div>
    </article>
  );
};

export default DashboardCard;
