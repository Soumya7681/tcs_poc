import { SALES_METRICS, formatPercent } from '../constants'
import PercentBar from './PercentBar'

const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })

export default function ProductTable({ products, loading, onEdit, onDelete }) {
  if (loading) return <p className="table-empty">Loading products...</p>
  if (!products.length) return <p className="table-empty">No products found</p>

  return (
    <div className="table-wrap">
      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th className="num">Price</th>
            {SALES_METRICS.map((metric) => (
              <th key={metric.key} className="num">
                <span className="metric-dot" style={{ background: metric.color }} />
                {metric.label}
              </th>
            ))}
            <th>Breakdown</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td className="num">{currency.format(product.price)}</td>
              {SALES_METRICS.map((metric) => (
                <td key={metric.key} className="num">
                  {formatPercent(product[metric.key])}
                </td>
              ))}
              <td className="breakdown-cell">
                <PercentBar values={product} />
              </td>
              <td className="row-actions">
                <button type="button" className="btn-link" onClick={() => onEdit(product)}>
                  Edit
                </button>
                <button type="button" className="btn-link danger" onClick={() => onDelete(product)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
