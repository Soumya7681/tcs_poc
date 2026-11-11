import { useState } from 'react'
import { SALES_METRICS, formatPercent } from '../constants'
import PercentBar from './PercentBar'

const emptyProduct = { name: '', category: '', price: '', salesImpacted: '', averageSales: '', notSold: '' }

const toForm = (product) =>
  product
    ? {
        name: product.name,
        category: product.category,
        price: product.price,
        salesImpacted: product.salesImpacted,
        averageSales: product.averageSales,
        notSold: product.notSold,
      }
    : emptyProduct

export default function ProductForm({ product, saving, error, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => toForm(product))
  const [formError, setFormError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const numbers = Object.fromEntries(SALES_METRICS.map((m) => [m.key, Number(form[m.key]) || 0]))
  const total = Number(SALES_METRICS.reduce((sum, m) => sum + numbers[m.key], 0).toFixed(2))

  const handleSubmit = (e) => {
    e.preventDefault()
    const required = ['name', 'category', 'price', ...SALES_METRICS.map((m) => m.key)]
    if (required.some((field) => String(form[field]).trim() === '')) {
      setFormError('All fields are required')
      return
    }
    if (Number(form.price) < 0) {
      setFormError('Price cannot be negative')
      return
    }
    if (SALES_METRICS.some((m) => numbers[m.key] < 0 || numbers[m.key] > 100)) {
      setFormError('Each percentage must be between 0 and 100')
      return
    }
    if (total !== 100) {
      setFormError(`Percentages must add up to 100% (currently ${formatPercent(total)})`)
      return
    }
    setFormError('')
    onSubmit({
      name: form.name.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      ...numbers,
    })
  }

  const message = formError || error

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <form className="modal" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} noValidate>
        <h2>{product ? 'Edit product' : 'Add product'}</h2>

        <label htmlFor="name">Name</label>
        <input id="name" name="name" value={form.name} onChange={handleChange} autoFocus />

        <label htmlFor="category">Category</label>
        <input id="category" name="category" value={form.category} onChange={handleChange} />

        <label htmlFor="price">Price</label>
        <input id="price" name="price" type="number" min="0" value={form.price} onChange={handleChange} />

        <fieldset className="percent-fields">
          <legend>Sales breakdown (%)</legend>
          {SALES_METRICS.map((metric) => (
            <div key={metric.key} className="percent-field">
              <label htmlFor={metric.key}>
                <span className="metric-dot" style={{ background: metric.color }} />
                {metric.label}
              </label>
              <input
                id={metric.key}
                name={metric.key}
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={form[metric.key]}
                onChange={handleChange}
              />
            </div>
          ))}
        </fieldset>

        <PercentBar values={numbers} />
        <p className={`percent-total${total === 100 ? ' ok' : ''}`}>Total: {formatPercent(total)} / 100%</p>

        {message && <p className="form-error" role="alert">{message}</p>}

        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}
