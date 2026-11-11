import { SALES_METRICS, formatPercent } from '../constants'

export default function PercentBar({ values, className = '' }) {
  return (
    <div className={`percent-bar ${className}`} role="img" aria-label={SALES_METRICS.map((m) => `${m.label} ${formatPercent(values[m.key])}`).join(', ')}>
      {SALES_METRICS.map((metric) =>
        values[metric.key] > 0 ? (
          <span
            key={metric.key}
            title={`${metric.label}: ${formatPercent(values[metric.key])}`}
            style={{ width: `${values[metric.key]}%`, background: metric.color }}
          />
        ) : null
      )}
    </div>
  )
}
