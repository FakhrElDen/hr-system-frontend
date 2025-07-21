import axios from 'axios'

const api = axios.create({
  baseURL: 'http://hr-system.localhost/api', // your Laravel backend API base
  withCredentials: true, // if using Sanctum
})

// Add Authorization header automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api