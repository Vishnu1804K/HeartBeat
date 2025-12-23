import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig, AxiosError } from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';

const api: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

// Handle token expiration
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    register: (data: { email: string; password: string }): Promise<AxiosResponse> =>
        api.post('/auth/register', data),
    login: (data: { email: string; password: string }): Promise<AxiosResponse> =>
        api.post('/auth/login', data),
    forgotPassword: (data: { email: string }): Promise<AxiosResponse> =>
        api.post('/auth/forgot-password', data),
    resetPassword: (token: string, data: { password: string }): Promise<AxiosResponse> =>
        api.post(`/auth/reset-password/${token}`, data),
    verifyResetToken: (token: string): Promise<AxiosResponse> =>
        api.get(`/auth/verify-reset-token/${token}`)
};

// Profile APIs
export const profileAPI = {
    get: (): Promise<AxiosResponse> => api.get('/profile'),
    update: (data: Record<string, unknown>): Promise<AxiosResponse> => api.put('/profile', data)
};

// Fitness Goals APIs
export const fitnessAPI = {
    getGoals: (): Promise<AxiosResponse> => api.get('/fitness-goals'),
    setGoals: (data: { goals: Record<string, unknown>[] }): Promise<AxiosResponse> => api.post('/fitness-goals', data),
    updateGoals: (data: { goals: Record<string, unknown>[] }): Promise<AxiosResponse> => api.put('/fitness-goals', data),
    deleteGoals: (): Promise<AxiosResponse> => api.delete('/fitness-goals')
};

// Activities APIs
export const activitiesAPI = {
    get: (): Promise<AxiosResponse> => api.get('/activities'),
    log: (data: Record<string, unknown>): Promise<AxiosResponse> => api.post('/activities', data)
};

// Vital Signs APIs
export const vitalSignsAPI = {
    get: (): Promise<AxiosResponse> => api.get('/vital-signs'),
    add: (data: { type: string; value: string }): Promise<AxiosResponse> => api.post('/vital-signs', data),
    delete: (id: string): Promise<AxiosResponse> => api.delete(`/vital-signs/${id}`)
};

// Recommendations API
export const recommendationsAPI = {
    get: (): Promise<AxiosResponse> => api.get('/recommendations')
};

// Healthcare Providers APIs
export const healthcareAPI = {
    getProviders: (): Promise<AxiosResponse> => api.get('/healthcare-providers'),
    addProvider: <T extends object>(data: T): Promise<AxiosResponse> => api.post('/healthcare-providers', data),
    updateProvider: <T extends object>(id: string, data: T): Promise<AxiosResponse> => api.put(`/healthcare-providers/${id}`, data),
    deleteProvider: (id: string): Promise<AxiosResponse> => api.delete(`/healthcare-providers/${id}`),
    getAppointments: (): Promise<AxiosResponse> => api.get('/appointments'),
    scheduleAppointment: <T extends object>(data: T): Promise<AxiosResponse> => api.post('/appointments', data),
    updateAppointment: <T extends object>(id: string, data: T): Promise<AxiosResponse> => api.put(`/appointments/${id}`, data),
    deleteAppointment: (id: string): Promise<AxiosResponse> => api.delete(`/appointments/${id}`)
};

// Resources APIs
export const resourcesAPI = {
    getAll: (params?: { type?: string; category?: string; search?: string }): Promise<AxiosResponse> =>
        api.get('/resources', { params }),
    getOne: (id: string): Promise<AxiosResponse> => api.get(`/resources/${id}`),
    getCategories: (): Promise<AxiosResponse> => api.get('/resources/categories'),
    getSaved: (): Promise<AxiosResponse> => api.get('/resources/user/saved'),
    save: (id: string): Promise<AxiosResponse> => api.post(`/resources/${id}/save`),
    unsave: (id: string): Promise<AxiosResponse> => api.delete(`/resources/${id}/save`)
};

export default api;
