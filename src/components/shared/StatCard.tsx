import type { ReactElement } from "react";

export type StatCardProps = {
  label: string;
  value: string;
  note?: string;
  trend?: string;
  trendVariant?: "success" | "danger" | "neutral";
};

export function StatCard({
  label,
  value,
  note,
  trend,
  trendVariant = "neutral",
}: StatCardProps): ReactElement {
  const trendColor = {
    success: "var(--color-accent-green-text)",
    danger: "var(--color-accent-red-text)",
    neutral: "var(--color-brand-muted)",
  }[trendVariant];

  const valueColor =
    trendVariant === "danger"
      ? "var(--color-accent-red-text)"
      : "var(--color-brand-black)";

  return (
    <div className="card">
      <p
        className="label-caps"
        style={{ marginBottom: "12px" }}
      >
        {label}
      </p>

      <p
        style={{
          fontSize: "var(--font-size-display)",
          fontWeight: 700,
          lineHeight: 1,
          color: valueColor,
        }}
      >
        {value}
      </p>

      {note ? (
        <p
          className="label-caps"
          style={{ marginTop: "4px" }}
        >
          {note}
        </p>
      ) : null}

      {trend ? (
        <p
          style={{
            fontSize: "var(--font-size-caption)",
            fontWeight: 500,
            color: trendColor,
            marginTop: "8px",
          }}
        >
          {trend}
        </p>
      ) : null}
    </div>
  );
}
