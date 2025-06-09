// utils/api.ts
export async function fetchProducts(filters: { category?: string; minPrice?: number; maxPrice?: number; available?: boolean }) {
    const qs = new URLSearchParams();
    if (filters.category) qs.set('category', filters.category);
    if (filters.minPrice != null) qs.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice != null) qs.set('maxPrice', filters.maxPrice.toString());
    if (filters.available != null) qs.set('available', filters.available.toString());
    return fetch(`/api/products?${qs.toString()}`).then(r => r.json());
}
