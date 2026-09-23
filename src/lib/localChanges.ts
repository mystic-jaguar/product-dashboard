import type { Product } from "@/services/products";

// DummyJSON only pretends to save add/edit/delete. We keep our own changes in
// localStorage and lay them over every API response, so the app shows them
// and they survive a refresh.
// ponytail: per-browser only; a real backend would make this file unnecessary.

type Changes = {
  created: Product[];
  updated: Record<number, Partial<Product>>;
  deleted: number[];
};

const KEY = "product-changes";
// API ids go up to 194; local ids start far above so they never clash.
const FIRST_LOCAL_ID = 10001;

function read(): Changes {
  try {
    const raw = typeof window === "undefined" ? null : localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Broken JSON: start fresh.
  }
  return { created: [], updated: {}, deleted: [] };
}

function write(c: Changes) {
  localStorage.setItem(KEY, JSON.stringify(c));
}

export const isLocalId = (id: number) => id >= FIRST_LOCAL_ID;

export function getCreated() {
  return read().created;
}

export function findCreated(id: number) {
  return read().created.find((p) => p.id === id);
}

export function isDeleted(id: number) {
  return read().deleted.includes(id);
}

export function deletedCount() {
  return read().deleted.filter((id) => !isLocalId(id)).length;
}

// Apply edits and hide deleted items in a list from the API.
export function applyChanges(products: Product[]) {
  const c = read();
  return products
    .filter((p) => !c.deleted.includes(p.id))
    .map((p) => (c.updated[p.id] ? { ...p, ...c.updated[p.id] } : p));
}

export function saveCreated(product: Omit<Product, "id">) {
  const c = read();
  const id = Math.max(FIRST_LOCAL_ID - 1, ...c.created.map((p) => p.id)) + 1;
  const created = { ...product, id } as Product;
  c.created.unshift(created);
  write(c);
  return created;
}

export function saveUpdated(id: number, fields: Partial<Product>) {
  const c = read();
  if (isLocalId(id)) {
    c.created = c.created.map((p) => (p.id === id ? { ...p, ...fields } : p));
  } else {
    c.updated[id] = { ...c.updated[id], ...fields };
  }
  write(c);
}

export function saveDeleted(id: number) {
  const c = read();
  if (isLocalId(id)) c.created = c.created.filter((p) => p.id !== id);
  else c.deleted.push(id);
  write(c);
}
