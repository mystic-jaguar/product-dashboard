import { test } from "node:test";
import assert from "node:assert/strict";
import { pageList } from "./pages.ts";

test("page list with gaps", () => {
  assert.deepEqual(pageList(1, 1), [1]);
  assert.deepEqual(pageList(1, 3), [1, 2, 3]);
  assert.deepEqual(pageList(5, 20), [1, "…", 4, 5, 6, "…", 20]);
  assert.deepEqual(pageList(20, 20), [1, "…", 19, 20]);
});
