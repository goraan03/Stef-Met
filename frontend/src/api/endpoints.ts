import { apiClient } from './client';
import type {
    Category,
    Product,
    Announcement,
    Setting,
    ContactFormData,
} from '@/types';

export const categoriesApi = {
    getAll: () =>
        apiClient.get<Category[]>('/categories'),

    create: (data: Partial<Category>) =>
        apiClient.post<Category>('/categories', data),

    update: (id: string, data: Partial<Category>) =>
        apiClient.patch<Category>(`/categories/${id}`, data),

    delete: (id: string) =>
        apiClient.delete<Category>(`/categories/${id}`),
};

export const productsApi = {
    getAll: (params?: { categoryId?: string; visible?: boolean }) =>
        apiClient.get<Product[]>('/products', { params }),

    getBySlug: (slug: string) =>
        apiClient.get<Product>(`/products/${slug}`),

    create: (data: Partial<Product>) =>
        apiClient.post<Product>('/products', data),

    update: (id: string, data: Partial<Product>) =>
        apiClient.patch<Product>(`/products/${id}`, data),

    delete: (id: string) =>
        apiClient.delete<Product>(`/products/${id}`),
};

export const announcementsApi = {
    getAll: (params?: { type?: string; visible?: boolean }) =>
        apiClient.get<Announcement[]>('/announcements', { params }),

    getBySlug: (slug: string) =>
        apiClient.get<Announcement>(`/announcements/${slug}`),

    create: (data: Partial<Announcement>) =>
        apiClient.post<Announcement>('/announcements', data),

    update: (id: string, data: Partial<Announcement>) =>
        apiClient.patch<Announcement>(`/announcements/${id}`, data),

    delete: (id: string) =>
        apiClient.delete<Announcement>(`/announcements/${id}`),
};

export const settingsApi = {
    getPublic: () =>
        apiClient.get<Setting[]>('/settings/public'),

    getAll: () =>
        apiClient.get<Setting[]>('/settings'),

    update: (key: string, data: Partial<Setting>) =>
        apiClient.patch<Setting>(`/settings/${key}`, data),
};

export const messagesApi = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    create: (data: ContactFormData) =>
        apiClient.post<any>('/messages', data),

    getAll: (params?: { isRead?: boolean }) =>
        apiClient.get<any[]>('/messages', { params }),

    markAsRead: (id: string) =>
        apiClient.patch<any>(`/messages/${id}/read`),

    delete: (id: string) =>
        apiClient.delete<any>(`/messages/${id}`),
};

export const uploadsApi = {
    upload: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return apiClient.post<{ url: string }>('/uploads', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
};

export const authApi = {
  login: (data: { email: string; password: string }) =>
    apiClient.post<{ access_token: string; user: any }>('/auth/login', data),

  getMe: () =>
    apiClient.get<any>('/auth/me'),
};