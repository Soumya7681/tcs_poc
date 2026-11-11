import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMe, logout } from '../redux/authSlice'
import {
  clearProductError,
  createProduct,
  deleteProduct,
  fetchProducts,
  fetchStats,
  updateProduct,
} from '../redux/productSlice'
import { useTheme } from '../context/useTheme'
import StatusCards from '../components/StatusCards'
import ProductForm from '../components/ProductForm'
import ProductTable from '../components/ProductTable'
import './Dashboard.css'

export default function Dashboard() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const { items, loading, saving, error } = useSelector((state) => state.products)
  const { theme, toggleTheme } = useTheme()

  const [editing, setEditing] = useState(null)

  const refresh = useCallback(() => {
    dispatch(fetchProducts())
    dispatch(fetchStats())
  }, [dispatch])

  useEffect(() => {
    if (!user) dispatch(fetchMe())
  }, [dispatch, user])

  useEffect(() => {
    refresh()
  }, [refresh])

  const openForm = (product = {}) => {
    dispatch(clearProductError())
    setEditing(product)
  }

  const handleSave = async (values) => {
    const action = editing.id
      ? updateProduct({ id: editing.id, ...values })
      : createProduct(values)
    const result = await dispatch(action)
    if (!result.error) {
      setEditing(null)
      refresh()
    }
  }

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"?`)) return
    const result = await dispatch(deleteProduct(product.id))
    if (!result.error) refresh()
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Products</h1>
          {user && <p className="welcome">Signed in as {user.name}</p>}
        </div>
        <div className="header-actions">
          <button type="button" className="btn-secondary" onClick={toggleTheme}>
            {theme === 'dark' ? 'Light' : 'Dark'} mode
          </button>
          <button type="button" className="btn-secondary" onClick={() => dispatch(logout())}>
            Logout
          </button>
        </div>
      </header>

      <StatusCards />

      <section className="products-section">
        <div className="products-toolbar">
          <h2>All products</h2>
          <button type="button" className="btn-primary" onClick={() => openForm()}>
            Add product
          </button>
        </div>

        {error && !editing && <p className="form-error" role="alert">{error}</p>}

        <ProductTable products={items} loading={loading} onEdit={openForm} onDelete={handleDelete} />
      </section>

      {editing && (
        <ProductForm
          product={editing.id ? editing : null}
          saving={saving}
          error={error}
          onSubmit={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  )
}
