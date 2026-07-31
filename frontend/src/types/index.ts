export interface ApiResponse<T> {
    data: T;
    message?: string;
    success?: boolean;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    order: number;
    _count?: {
        products: number;
    };
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    description?: string;
    categoryId: string;
    images: string[];
    visible: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
    category: Category;
}

export enum AnnouncementType {
    CURRENT = 'CURRENT',
    URGENT = 'URGENT',
}

export interface Announcement {
    id: string;
    type: AnnouncementType;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    imageUrl?: string;
    visible: boolean;
    publishedAt: string;
    expiresAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Setting {
    id: string;
    key: string;
    value: string;
    type: string;
    description?: string;
}

export interface ContactFormData {
    name: string;
    email: string;
    phone?: string;
    message: string;
}