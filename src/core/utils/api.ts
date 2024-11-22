//https://fakestoreapi.com/products
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com';

export const apiPath = (...paths: string[]): string => {
    const normalizedPath = paths.map(path => path.replace(/^\/|\/$/g, '')).join('/');
    return `${BASE_URL}/${normalizedPath}`;
};

// Usage Examples:
// apiPath('products') -> https://api.example.com/products
// apiPath('products', '123') -> https://api.example.com/products/123
// apiPath('users', '45', 'details') -> https://api.example.com/users/45/details