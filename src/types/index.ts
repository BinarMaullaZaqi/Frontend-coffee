export type EventStatus = "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";

export interface CategoryEvent {
  id: number;
  nama: string;
  deskripsi?: string;
  createdAt: string;
  updatedAt: string;
  _count?: { events: number };
}

export interface Pembicara {
  id: number;
  nama: string;
  spesialisasi: string;
  instansi: string;
  email: string;
  bio?: string;
  foto?: string;
  createdAt: string;
  updatedAt: string;
  _count?: { events: number };
}

export interface Event {
  id: number;
  judul: string;
  deskripsi: string;
  tanggal: string;
  lokasi: string;
  harga: number;
  kapasitas: number;
  imageUrl?: string;
  status: EventStatus;
  categoryId: number;
  pembicaraId: number;
  category: CategoryEvent;
  pembicara: Pembicara;
  createdAt: string;
  updatedAt: string;
}

export type CategoryFormData = {
  nama: string;
  deskripsi: string;
};

export type PembicaraFormData = {
  nama: string;
  spesialisasi: string;
  instansi: string;
  email: string;
  bio: string;
  foto: string;
};

export type EventFormData = {
  judul: string;
  deskripsi: string;
  tanggal: string;
  lokasi: string;
  harga: string;
  kapasitas: string;
  imageUrl: string;
  status: EventStatus;
  categoryId: string;
  pembicaraId: string;
};

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  message?: string;
  error?: string;
}

export interface AuthUser {
  nim: string;
  nama: string;
  role: "admin";
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (nim: string, password: string) => boolean;
  logout: () => void;
}