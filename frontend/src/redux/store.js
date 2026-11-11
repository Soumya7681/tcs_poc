import { configureStore } from '@reduxjs/toolkit'
import authReducer, { logout } from './authSlice'
import productReducer from './productSlice'
import { setUnauthorizedHandler } from '../api/client'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
  },
})

setUnauthorizedHandler(() => store.dispatch(logout()))
