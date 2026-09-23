import { test } from "node:test";
import assert from "node:assert/strict";
import { validateProduct } from "./validateProduct.ts";

const ok = { title: "Desk lamp", description: "A bright LED desk lamp", category: "lighting", brand: "", price: "19.99", stock: "5" };

test("valid product has no errors", () => {
  assert.deepEqual(validateProduct(ok), {});
});

test("bad values are reported", () => {
  const e = validateProduct({ ...ok, title: "a", description: "", category: "", price: "-1", stock: "2.5" });
  assert.deepEqual(Object.keys(e).sort(), ["category", "description", "price", "stock", "title"]);
  assert.ok(validateProduct({ ...ok, price: "1.999" }).price);
  assert.ok(validateProduct({ ...ok, price: "abc" }).price);
  assert.equal(validateProduct({ ...ok, stock: "0" }).stock, undefined);
});
