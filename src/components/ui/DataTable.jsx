import StatusBadge from "./StatusBadge";

const DataTable = ({ rows = [] }) => {
  return (
    <div className="table-academic">
      <table>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Code</th>
            <th>Attendance</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="font-semibold">{row.subject}</td>
              <td>{row.code}</td>
              <td>{row.attendance}%</td>
              <td>
                <StatusBadge status={row.status} label={row.statusLabel} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
