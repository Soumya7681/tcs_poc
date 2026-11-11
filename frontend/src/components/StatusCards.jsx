import { useSelector } from 'react-redux'
import { SALES_METRICS, formatPercent } from '../constants'
import PercentBar from './PercentBar'

export default function StatusCards() {
  const { averages, total } = useSelector((state) => state.products)

  return (
    <section className="status-section">
      <div className="status-cards">
        {SALES_METRICS.map((metric) => (
          <div key={metric.key} className="status-card" style={{ '--status-color': metric.color }}>
            <span className="status-label">{metric.label}</span>
            <span className="status-percentage">{formatPercent(averages[metric.key])}</span>
            <span className="status-count">Average across {total} products</span>
            <span className="status-bar">
              <span style={{ width: `${averages[metric.key]}%` }} />
            </span>
          </div>
        ))}
      </div>
      <PercentBar values={averages} className="large" />
    </section>
  )
}
