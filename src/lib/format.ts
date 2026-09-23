export const formatPrice = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export const formatCategory = (slug: string) => slug.replace(/-/g, " ");
