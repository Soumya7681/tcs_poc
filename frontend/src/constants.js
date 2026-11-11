export const SALES_METRICS = [
  { key: 'salesImpacted', label: 'Sales Impacted', color: '#dc2626' },
  { key: 'averageSales', label: 'Average Sales', color: '#d97706' },
  { key: 'notSold', label: 'Not Sold', color: '#6b7280' },
]

export const formatPercent = (value) => `${Number(Number(value || 0).toFixed(2))}%`
