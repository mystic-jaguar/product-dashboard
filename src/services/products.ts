import { api, ApiError } from "@/lib/api";
import type { ListQuery } from "@/lib/query";
import {
  applyChanges,
  deletedCount,
  findCreated,
  getCreated,
  isDeleted,
  isLocalId,
  saveCreated,
  saveDeleted,
  saveUpdated,
} from "@/lib/localChanges";

export type Review = {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
};

export type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  brand?: string;
  thumbnail: string;
  images: string[];
  reviews?: Review[];
};

export type ProductInput = Pick<Product, "title" | "description" | "category" | "price" | "stock"> & {
  brand?: string;
};

export type ProductList = { products: Product[]; total: number };
export type Category = { slug: string; name: string };

const LIST_FIELDS = "title,category,price,rating,stock,thumbnail";

export async function getProducts(query: ListQuery, signal?: AbortSignal): Promise<ProductList> {
  const { page, limit, q, category, sortBy, order, delay } = query;
  const url = q
    ? "/products/search"
    : category
      ? `/products/category/${encodeURIComponent(category)}`
      : "/products";

  // Locally added products sit in front of the plain, unfiltered, unsorted list:
  // the full list is [...created, ...apiProducts]. Work out which part of each this page needs.
  // ponytail: they are not mixed into search/category/sorted results; merge them if that matters.
  const created = !q && !category && !sortBy ? getCreated() : [];
  const start = (page - 1) * limit;
  const localPart = created.slice(start, start + limit);
  const skip = Math.max(0, start - created.length);

  const { data } = await api.get<ProductList>(url, {
    signal,
    params: {
      q: q || undefined,
      limit: limit - localPart.length || 1, // limit=0 means "all" in DummyJSON, so ask for 1 and drop it
      skip,
      select: LIST_FIELDS,
      sortBy: sortBy || undefined,
      order: sortBy ? order : undefined,
      delay: delay || undefined,
    },
  });

  const apiPart = localPart.length === limit ? [] : applyChanges(data.products);
  let total = data.total;
  // Deleted API items only change the count of the plain list (we don't know which search they belong to).
  if (!q && !category) total = total + created.length - deletedCount();
  return { products: [...localPart, ...apiPart], total: Math.max(total, 0) };
}

export async function getProduct(id: number): Promise<Product> {
  if (isLocalId(id)) {
    const p = findCreated(id);
    if (!p) throw new ApiError("Product not found", 404);
    return p;
  }
  if (isDeleted(id)) throw new ApiError("Product not found", 404);
  const { data } = await api.get<Product>(`/products/${id}`);
  return applyChanges([data])[0];
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>("/products/categories");
  return data;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  // The API validates and echoes the product but does not store it.
  const { data } = await api.post<Product>("/products/add", input);
  return saveCreated({ ...data, rating: 0, thumbnail: "", images: [], reviews: [] });
}

export async function updateProduct(id: number, input: ProductInput): Promise<void> {
  // Local products do not exist on the server, so only the API items get a real PUT.
  if (!isLocalId(id)) await api.put(`/products/${id}`, input);
  saveUpdated(id, input);
}

export async function deleteProduct(id: number): Promise<void> {
  if (!isLocalId(id)) await api.delete(`/products/${id}`);
  saveDeleted(id);
}
