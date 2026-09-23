# Notes

## Choices

**Search and category filter can't be used together.** DummyJSON has no endpoint that does both. My app treats them as exclusive: typing a search clears the category, and picking a category clears the search. A hint under the search box explains this. If both are in the URL, search wins.
I didn't want to fetch all 194 products and filter them in the browser. That would break the rule that pages load from the API with `limit`/`skip`, and the "Showing X of Y" count would no longer come from the server. Sort still works with both.

**Add, edit and delete are faked by the API.** I still call the real endpoints (`POST /products/add`, `PUT`, `DELETE`), so the requests and validation go through the shared Axios file. After a call succeeds, I save the change in `localStorage` (`src/lib/localChanges.ts`) and apply it on top of every API response:
- edits are merged into the matching products
- deleted ids are filtered out, and the total count goes down
- new products get local ids starting at 10001, so they never clash with API ids (1–194). They sit in front of the plain, unsorted list. Pagination takes them into account: page 1 asks the API for fewer items, and later pages shift `skip`, so no API product gets skipped. A product that only exists locally is never sent to the API for edit or delete, because the API would return 404.

Changes survive a refresh but are saved per browser only. A real backend would make this layer unnecessary.

**Old search results never replace new ones.** Two protections in `useProducts`: each new query aborts the previous request with an `AbortController`, and a request counter drops any response that isn't the latest. You can test it with `/products?delay=2000` (the `delay` value is passed on to the API).

**Bad URL values.** `parseQuery` checks every parameter. `page=abc` becomes 1, `limit=7` becomes 10, and unknown sort values are ignored. `page=999` jumps to the last page once the total is known.

**Double submits.** Login, Save and Delete each use a `useRef` flag as well as a disabled button. The ref changes right away, so a second click is blocked even before React re-renders.

**Auth guard.** The token is stored in `localStorage`, so the check runs in the browser (`AuthGuard`). A 401 from any request logs the user out.

## A problem I faced

At first, my list hook reset `loading`/`error` with `setState` at the start of the effect. The React 19 ESLint rule `react-hooks/set-state-in-effect` flagged this because it causes extra renders. I rewrote the hook so each result stores the query "key" it belongs to. `loading` is now worked out as `result.key !== currentKey` instead of being stored. This removed the extra state, and a stale response can no longer leave the screen in a mixed state.

A second one: new local products were first added on top of page 1 and then cut down to `limit`. That silently pushed the last API product off page 1, and it never appeared on page 2 either. I fixed it by treating the list as `[...localProducts, ...apiProducts]` and working out the right `limit`/`skip` for the API part.

## Where AI helped

_Write this in your own words._ Suggestions: scaffolding, drafting components, finding the pagination bug above, and checking edge cases in the browser.
