
export const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:3001";
export const API_URL = `${BASE_URL}/api/auth`;

export const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/150";
    if (path.startsWith('http') || path.startsWith('data:')) return path;

    // Check if it's a 3D icon from public folder
    if (path.includes('3d-icons')) {
        return `${window.location.origin}${path.startsWith('/') ? '' : '/'}${path}`;
    }

    return `${BASE_URL}/${path}`;
};
