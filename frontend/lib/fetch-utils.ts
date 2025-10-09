
import axios from 'axios';

const BASE_URL=process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api/v1";

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// api.interceptors.request.use((req) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//         .headersconfig.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// // 
// api.interceptors.response.use((response) => response, (error) => {
//     if (error.response && error.response.status === 401) {
//         window.dispatchEvent(new Event('force-logout'))
//     }
//     return Promise.reject(error)
// })

// export const postData = async<T>(path: string, data: unknown): Promise<T> => {
//     const response = await api.post(path, data);
//     return response.data
// }

// export const fetchData = async<T>(path: string): Promise<T> => {
//     const response = await api.get(path);
//     return response.data;
// }

// export const updateData = async<T>(path: string, data: unknown): Promise<T> => {
//     const response = await api.put(path, data);
//     return response.data
// }

// export const deleteData = async<T>(path: string): Promise<T> => {
//     const response = await api.delete(path);
//     return response.data
// }