export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('sr-RS', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date);
};

export const isExpired = (expiresAt?: string): boolean => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
};

export const truncate = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
};

export const getImageUrl = (url?: string): string => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
        return url;
    }
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const baseDomain = apiUrl.replace(/\/api$/, '');
    return `${baseDomain}${url.startsWith('/') ? '' : '/'}${url}`;
};