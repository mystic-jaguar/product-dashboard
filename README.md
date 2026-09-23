# Product Admin Dashboard

A small admin dashboard for logging in and managing products, built on the [DummyJSON](https://dummyjson.com) API.

**Stack:** Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · Axios · TypeScript

**Live:** _add Vercel link here_

## Setup

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # unit tests for URL parsing, pagination and form validation
npm run lint
npm run build
```

Log in with **emilys** / **emilyspass**.

No environment variables are needed.

## What's finished

- [x] **Login** (`POST /auth/login`): shows an error for wrong details, product pages are protected, and there's a logout button
- [x] **Product list:** image, title, category, price, rating and stock. A table on desktop and cards on mobile
- [x] **Pagination** with `limit` and `skip`: page numbers with `…` gaps, Previous/Next, a page size option (10/20/50) and "Showing 21–40 of 194"
- [x] **Search** with `/products/search?q=`: waits 400 ms after typing stops, then goes back to page 1
- [x] **Category filter** (`/products/categories`) and **sort** by price, rating or title (ascending or descending)
- [x] **Product details** at `/products/[id]`: image gallery, description, price and reviews. Shows a "not found" view for a bad or deleted id
- [x] **Add, edit and delete:** a validated form and a confirm popup before deleting
- [x] **Loading, empty and error states**, with a Retry button
- [x] **One shared Axios file** (`src/lib/api.ts`): adds the token to every request, handles errors in one place, and logs out on 401
- [x] **All list state is in the URL** (page, limit, q, category, sortBy, order), so refreshing or sharing a link shows the same result
- [x] No React Query, SWR or table/pagination libraries
- [x] **Edge cases:** old searches never replace new ones, bad URL values fall back to defaults, and Save/Login/Delete can't fire twice

## Project layout

```
src/
  lib/api.ts             shared Axios instance (token + error handling)
  lib/query.ts           URL <-> list query (checks every value)
  lib/localChanges.ts    local layer that remembers add/edit/delete
  lib/validateProduct.ts form validation
  services/              all API calls (auth.ts, products.ts), no UI code
  hooks/                 useProducts, useProduct, useCategories, useDeleteProduct
  components/            small UI pieces (table, cards, pagination, dialog, form…)
  app/                   routes: /login, /products, /products/new, /products/[id], /products/[id]/edit
```

## Notes

See [NOTES.md](NOTES.md) for my choices, a problem I faced, and where AI helped.
