import { SectionTable } from "./AnalyticsShared";
import { formatDateTime } from "./analyticsUtils";

export default function DisputePatternsSection({ disputes = [] }) {
  return (
    <SectionTable
      title="Dispute Patterns (Failed Tx > 2)"
      columns={["User", "Email", "Failed Tx", "Last Failure"]}
      rows={disputes.map((item) => [
        `${item?.first_name || ""} ${item?.last_name || ""}`.trim() || "-",
        item?.email || "-",
        Number(item?.failed_transactions || 0).toLocaleString(),
        formatDateTime(item?.last_failure),
      ])}
      emptyText="No users with repeated failed transactions."
    />
  );
}
