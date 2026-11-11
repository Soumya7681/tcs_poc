import axios from 'axios'

const http = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' })

let onUnauthorized = () => {}

export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler
}

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

export const request = async (config, { skipAuthRedirect = false } = {}) => {
  try {
    const response = await http.request(config)
    return response.data
  } catch (error) {
    const status = error.response?.status
    if (status === 401 && !skipAuthRedirect) onUnauthorized()
    throw new ApiError(error.response?.data?.message || error.message || 'Network error', status)
  }
}

export const errorMessage = (error) => error.message || 'Something went wrong'
