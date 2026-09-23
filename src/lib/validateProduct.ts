// Form values are strings (straight from inputs); this checks them and builds the API payload.

export type ProductFormValues = {
  title: string;
  description: string;
  category: string;
  brand: string;
  price: string;
  stock: string;
};

export type ProductFormErrors = Partial<Record<keyof ProductFormValues, string>>;

export function validateProduct(v: ProductFormValues): ProductFormErrors {
  const e: ProductFormErrors = {};
  const title = v.title.trim();
  if (title.length < 3) e.title = "Title must be at least 3 characters";
  else if (title.length > 100) e.title = "Title must be 100 characters or less";

  if (v.description.trim().length < 10) e.description = "Description must be at least 10 characters";
  if (!v.category) e.category = "Choose a category";

  const price = Number(v.price);
  if (v.price.trim() === "" || !Number.isFinite(price)) e.price = "Enter a price";
  else if (price <= 0) e.price = "Price must be more than 0";
  else if (!/^\d+(\.\d{1,2})?$/.test(v.price.trim())) e.price = "Use at most 2 decimals";

  if (!/^\d+$/.test(v.stock.trim())) e.stock = "Stock must be a whole number, 0 or more";
  return e;
}

export function toPayload(v: ProductFormValues) {
  return {
    title: v.title.trim(),
    description: v.description.trim(),
    category: v.category,
    brand: v.brand.trim() || undefined,
    price: Number(v.price),
    stock: Number(v.stock),
  };
}
