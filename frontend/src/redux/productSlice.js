import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { errorMessage, request } from '../api/client'

const normalize = ({ _id, ...rest }) => ({ id: _id, ...rest })

const thunk = (type, request) =>
  createAsyncThunk(type, async (arg, { rejectWithValue }) => {
    try {
      return await request(arg)
    } catch (error) {
      return rejectWithValue(errorMessage(error))
    }
  })

export const fetchProducts = thunk('products/fetchAll', async () => {
  const data = await request({ url: '/products' })
  return data.map(normalize)
})

export const fetchStats = thunk('products/fetchStats', () => request({ url: '/products/stats' }))

export const createProduct = thunk('products/create', async (input) =>
  normalize(await request({ url: '/products', method: 'post', data: input }))
)

export const updateProduct = thunk('products/update', async ({ id, ...input }) =>
  normalize(await request({ url: `/products/${id}`, method: 'put', data: input }))
)

export const deleteProduct = thunk('products/delete', async (id) => {
  await request({ url: `/products/${id}`, method: 'delete' })
  return id
})

const initialState = {
  items: [],
  averages: { salesImpacted: 0, averageSales: 0, notSold: 0 },
  total: 0,
  loading: false,
  saving: false,
  error: null,
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.averages = action.payload.averages
        state.total = action.payload.total
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id)
        if (index !== -1) state.items[index] = action.payload
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload)
      })
      .addMatcher(
        (action) => /^products\/(create|update|delete)\/pending$/.test(action.type),
        (state) => {
          state.saving = true
          state.error = null
        }
      )
      .addMatcher(
        (action) => /^products\/(create|update|delete)\/fulfilled$/.test(action.type),
        (state) => {
          state.saving = false
        }
      )
      .addMatcher(
        (action) => /^products\/(create|update|delete)\/rejected$/.test(action.type),
        (state, action) => {
          state.saving = false
          state.error = action.payload
        }
      )
  },
})

export const { clearProductError } = productSlice.actions
export default productSlice.reducer
