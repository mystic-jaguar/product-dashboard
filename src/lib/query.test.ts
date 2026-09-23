// Run with: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseQuery, toSearch } from "./query.ts";

const parse = (s: string) => parseQuery(new URLSearchParams(s));

test("bad values fall back to defaults", () => {
  const q = parse("page=abc&limit=7&sortBy=hack&order=up");
  assert.equal(q.page, 1);
  assert.equal(q.limit, 10);
  assert.equal(q.sortBy, "");
  assert.equal(q.order, "asc");
  assert.equal(parse("page=-3").page, 1);
  assert.equal(parse("page=99999999999999999999").page, 1);
});

test("search wins over category", () => {
  const q = parse("q=phone&category=beauty");
  assert.equal(q.q, "phone");
  assert.equal(q.category, "");
});

test("round trip keeps values and drops defaults", () => {
  assert.equal(toSearch(parse("")), "");
  const s = "?page=3&limit=20&category=beauty&sortBy=price&order=desc";
  assert.equal(toSearch(parse(s.slice(1))), s);
});
