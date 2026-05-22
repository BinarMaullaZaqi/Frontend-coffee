import axios from "axios";
import type { 
  ApiResponse, 
  CategoryEvent, 
  Pembicara, 
  Event, 
  CategoryFormData, 
  PembicaraFormData, 
  EventFormData 
} from "../types";

const client = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token"); // Ambil token dari session storage sesuai set-up authStore
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Ekspor API yang udah disinkronkan nama fungsinya buat CRUD Admin
export const categoryAPI = {
  getAll: () => client.get<ApiResponse<CategoryEvent[]>>("/categories"),
  create: (data: CategoryFormData) => client.post<ApiResponse<CategoryEvent>>("/categories", data),
  update: (id: number | string, data: CategoryFormData) => client.put<ApiResponse<CategoryEvent>>(`/categories/${id}`, data),
  delete: (id: number | string) => client.delete<ApiResponse<void>>(`/categories/${id}`),
};

export const pembicaraAPI = {
  getAll: () => client.get<ApiResponse<Pembicara[]>>("/pembicara"),
  create: (data: PembicaraFormData) => client.post<ApiResponse<Pembicara>>("/pembicara", data),
  update: (id: number | string, data: PembicaraFormData) => client.put<ApiResponse<Pembicara>>(`/pembicara/${id}`, data),
  delete: (id: number | string) => client.delete<ApiResponse<void>>(`/pembicara/${id}`),
};

export const eventAPI = {
  getAll: () => client.get<ApiResponse<Event[]>>("/events"),
  create: (data: EventFormData) => client.post<ApiResponse<Event>>("/events", data),
  update: (id: number | string, data: EventFormData) => client.put<ApiResponse<Event>>(`/events/${id}`, data),
  delete: (id: number | string) => client.delete<ApiResponse<void>>(`/events/${id}`),
};