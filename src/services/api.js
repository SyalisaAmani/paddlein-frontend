// import axios library for sending HTTP request to Laravel
import axios from 'axios'

// Instance axios (konfigurasi khusus untuk aplikasi Paddle Court Booking)
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        Accept: 'application/json',
        'Content-Type' : 'application/json',
    },
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('paddle-token')

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {

        if (
            error.response?.status === 401 &&
            !error.config?.url?.endsWith('/login')
        ) {
            localStorage.removeItem('paddle-token')
            localStorage.removeItem('paddle-user')
            

            window.location.href = '/login'
        }

        return Promise.reject(error)
    }
)
export default api