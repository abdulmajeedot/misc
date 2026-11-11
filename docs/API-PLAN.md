# PumpBOM – API plan & prototype review

Status: draft for the backend build · based on `pump-bom-glide.html` + `bom-data.js` (updated 12 Nov 2026: Dashboard, commodities, projection)

The prototype keeps **all data in the browser** (`bom-data.js` arrays) and filters, groups, totals and exports
everything client-side. That is fine for ~60 items and 4 models, but not for a real item master (10k–100k items),
years of price history and NRP lines. This document lists what the server must provide so that the UI only ever
asks for **one page at a time**, and so that a careless search cannot scan whole tables.

---

## 1. What the prototype does today (inventory)

| Tab | Data it reads | Writes | Client-side work that must move to the server |
|---|---|---|---|
| **BOM** | `PRODUCTS[].bom`, `MAT`, `PRICES` (rate for month) | BOM line qty (direct, no approval) | product search over all products **and all their BOM lines**; `priceFor()` per line; group subtotals |
| **Models** | `PRODUCTS` | motor/pump/panel/vendor/category/description (direct) | search across 9 columns, sort |
| **Material Master › Item Master** | `MAT`, `PRICES` (current-month rate), `CHANGES` (pending), drafts | drafts → change request (Save) | search over 8 columns, grouping by side, effective rate for **every** item |
| **Material Master › Monthly Prices** | `PRICES` | – (add-price UI removed) | date-range filter, "Latest/Superseded" per item+month, search |
| **Change Requests** | `CHANGES`, `ITEM_VERSIONS`, `MAT` | approve / reject / approve all | date filter, search inside request lines, version-history item picker |
| **NRP** | `NRP`, `PRODUCTS` (description/vendor by material) | edit date/material/qty, delete lines (direct) | date-range filter, search, total |
| **Material Planning** | `NRP` × `PRODUCTS[].bom` × `MAT` | – | full explosion (every NRP line × every BOM line) on each render, drill-down per item |
| **Dashboard** | `NRP`, `PRODUCTS` (BOMs), `PRICES` | – | per material × month: NRP qty, BOM cost per piece at that month's rates, change % vs previous month; totals (qty, Σ qty×price in crores, average change %) |
| **Dashboard › Projection** | `MAT[].commodity`, latest `PRICES`, `NRP` | projection settings (session only) | average latest price per commodity; projected cost per piece = Σ BOM qty × latest rate × (1 + commodity %) for every model |
| **Download (Ctrl+) )** | whatever rows are loaded in the grid | – | builds the file in the browser from loaded rows; saves via the Save As dialog (Chrome/Edge) or a download link |
| **Profile / roles** | `USERS`, `ROLES` | – | permission checks (`can('edit')`, `can('approve')`) |

---

## 2. Review findings

Ordered by impact. "Prototype-only" items disappear naturally once the API exists, but the API must be designed so they don't come back.

### High

1. **Permissions are enforced only in the browser.** `can('edit')`/`can('approve')` hide buttons and make grids read-only, but anyone can call the data layer. → Every write endpoint checks the role on the server (section 4.2).
2. **Approving does not check that the master is still as the requester saw it.** A change line stores `old`, but `applyRequest()` overwrites the field regardless of what happened since (another approved request, a direct fix). → Each request line carries `baseVer` of the item; approve returns **409 Conflict** if the item's current version differs (section 5.3).
3. **A pending request can grow while the approver is reviewing it.** Saving again adds lines to the requester's open request, so "Approve" may approve lines the approver never saw. → Requests get a `revision` number; approve/reject must send `If-Match: <revision>`; a stale revision returns 409.
4. **No maker-checker rule.** An Admin can approve their own request. → Server rejects approval when `approver_id = requester_id` (configurable).
5. **Identity is the display name.** `req.by = role` where `role = me.name`; the open request is found with `c.by === role`. Two users with the same name would share a request. → Use `user_id` everywhere; names are display only.
6. **Inconsistent write policy.** Item Master goes through Save + approval, but BOM qty, Models and NRP edits apply instantly with no audit trail, and BOM edits do not bump the BOM revision (`product.rev`). Decide per entity (suggested: BOM lines → change request + BOM revision; Models → change request; NRP → Save/Discard batch with audit log).
7. **NRP can no longer get new lines** (Add line removed). Plan an `Import from Excel` endpoint (section 5.6) or bring back a single-line add.

### Medium

8. **Everything is recomputed from full arrays on every render.** `ItemMaster` maps every material and calls `priceFor()` for each (`priceFor` scans all of `PRICES` → O(items × prices)); `PriceList` rebuilds the "latest per item+month" map each render; `MrpSheet` re-explodes all NRP × BOM lines each render. → Server endpoints return ready-made rows (effective rate, `is_latest`, gross requirement).
9. **All search is client-side substring matching over every row** (`matchQ`). → Server search with the same grammar, guarded (section 4.4).
10. **Typeaheads load everything.** BOM product search scans all products *and* every BOM line description; the version-history item picker filters all of `MAT` (it does cap results at 50 but still scans all). → Dedicated typeahead endpoints with `limit ≤ 20` and minimum query length.
11. **`TODAY` is hard-coded** (`bom-data.js`: `2026-11-11`), so `CUR_MONTH` (Item Master rate column, price-list default) goes stale. → `GET /api/me` returns `server_date`; never trust the PC clock for business dates.
12. **Date strings parsed as UTC.** `niceDay(new Date('2026-12-03'))` treats the string as UTC midnight; in time zones west of UTC it shows the previous day. India (UTC+5:30) is unaffected, but format `YYYY-MM-DD` strings without `new Date()` (or parse as local).
13. **Downloads only contain rows already loaded in the browser.** Once grids are lazy-loaded, "All rows shown" would be incomplete. → Server-side export (section 5.8).
14. **Runtime CDN dependencies** (React, Glide, `xlsx` via esm.sh/jsDelivr). The office LAN server must not need internet → bundle with Vite; serve the Excel writer from the bundle or generate files server-side.
15. **Module-level mutable globals** (`ME`, `CURRENT_GRID`, `DRAFT`, data arrays mutated in place, `bump()` to re-render). Workable in a prototype; in the real app move to a small store (React context + query cache) so pages can refetch and invalidate.

### Low / cleanup

16. Dead code: `planFor()` and `PLANS` in `bom-data.js` (only used to seed sample NRP); CSS for `.planbox`, `.range`, `.pform`, `.tools`, `.kpi` is mostly unused now.
17. A stray comment after `planBetween()` (`// rate taken from an earlier month`) belongs to `CARRIED`.
18. The drill-down indent uses literal em-space characters (`' '` written as the raw character, also in the export regex `/ /g`). Correct, but invisible – write ` ` explicitly.
19. Ctrl+F listener is registered by every `Grid` instance; harmless with one grid per tab, but move it to the page level.
20. `pump-bom-prototype.html` (first prototype) still carries its own copy of the data and is out of date – archive or delete before the build.

---

## 3. Data model (server)

```
users            (id PK, login, name, dept, role ENUM('Viewer','Contributor','Admin'), active)
models           (code PK, material UNIQUE, description, motor, pump, panel, vendor_code FK→vendors, category, family, ver)
vendors          (code PK, name)                                   -- fixes vendor code/name drift
bom_headers      (model_code FK, rev, effective_from, status)      -- BOM revision
bom_lines        (id PK, model_code, rev, item_code FK→materials, qty, line_no)
materials        (code PK, item, spec, uom, make, suppliers, side, sub_assembly, make_buy, lead_days, moq, commodity FK→commodities, ver)
commodities      (code PK, name, ref_uom NULL, ref_price NULL)       -- Cast Iron, Copper, Stainless Steel …; optional ₹/kg reference
projections      (id PK, user_id FK, name, from_date, to_date, base_month, is_default, updated_at)
projection_pcts  (projection_id FK, commodity FK, pct NUMERIC(5,1))  PK(projection_id, commodity)   -- −20.0 … +50.0
material_versions(code, ver, snapshot JSON, approved_by, approved_at, request_id)   PK(code, ver)
prices           (id PK, item_code, price_month DATE, rate, supplier, entered_on, entered_by, note)   -- duplicates allowed
change_requests  (id PK, requester_id, status, revision, created_at, updated_at, decided_by, decided_at)
change_lines     (id PK, request_id, item_code, field, old_value, new_value, base_ver)
nrp_lines        (id PK, plan_date DATE, material FK→models.material, qty, updated_by, updated_at)
audit_log        (id, entity, entity_id, action, user_id, at, before JSON, after JSON)
```

**Indexes that the search/paging rules rely on**

| Table | Index | Used by |
|---|---|---|
| materials | PK(code); `(side, code)`; trigram / full-text on `code, item, spec, make, suppliers` | Item Master paging by side, search, typeahead |
| prices | `(item_code, price_month DESC, entered_on DESC, id DESC)`; `(price_month, item_code)` | effective rate, price list by range |
| nrp_lines | `(plan_date, id)`; `(material, plan_date)` | NRP by range, planning aggregation |
| bom_lines | `(model_code, rev)`; `(item_code)` | BOM, where-used, planning |
| change_requests | `(status, updated_at DESC)`; `(created_at)` | request list, date filter |
| change_lines | `(request_id)`; `(item_code)`; trigram on `old_value,new_value` (optional) | request cards, search |
| models | trigram on `code, material, description, vendor/category` | Models, BOM typeahead |
| materials | `(commodity)` | commodity summary, projection pricing |
| nrp_lines | `(material, plan_date)` (above) | Dashboard rows per material × month |

Effective price: either a SQL view (`DISTINCT ON (item_code) … WHERE price_month <= :month ORDER BY item_code, price_month DESC, entered_on DESC, id DESC`) or a materialised `price_effective(item_code, month, rate, price_id)` refreshed when prices change.

---

## 4. API conventions

### 4.1 Basics
- Base path `/api/v1`, JSON, UTF-8. Dates `YYYY-MM-DD`; timestamps ISO-8601 with offset.
- Errors: `{ "error": { "code": "conflict", "message": "...", "details": {...} } }` with 400 / 401 / 403 / 404 / 409 / 422 / 429.
- Every mutable row returns `ver` (or an `ETag`); updates send `If-Match` → **409** on mismatch.

### 4.2 Auth & roles
- Office LAN: Windows Integrated Auth (IIS / reverse proxy) or AD/LDAP login → session cookie.
- `GET /me` → `{ id, name, dept, role, permissions: {edit, approve}, server_date }`.
- Server checks on every write: Viewer → 403; approve/reject → Admin only, and not the requester.

### 4.3 Pagination – keyset (cursor), never OFFSET for big tables
```
GET /materials?limit=100&cursor=eyJzaWRlIjoiTU9UT1IiLCJjb2RlIjoiTS1CUkctNjIwNCJ9
→ { "items": [...], "next_cursor": "…" | null, "total": 12450, "total_is_estimate": false }
```
- `limit` default 100, **max 500** (grids), **max 20** (typeaheads).
- Cursor = opaque base64 of the last row's sort key (e.g. `side, code` or `plan_date, id`). Changing sort/filters resets the cursor.
- `total` exact when cheap (filtered count ≤ 10 000), otherwise an estimate with `total_is_estimate: true` – Glide needs a row count to size the scrollbar.

### 4.4 Search grammar & guards (same as the UI's two boxes)
```
GET /materials?q=bearing|seal&q=skf|burgmann
      ↑ box 1: OR terms        ↑ box 2: OR terms      boxes are ANDed
```
Server-side guards (reject with 422 or silently trim):

| Rule | Value |
|---|---|
| Boxes (`q` params) | max 2 |
| OR terms per box | max 5 |
| Term length | min **2** chars (a 1-char term is ignored), max 50 |
| Total query length | max 120 chars |
| Wildcards | none exposed; server uses `ILIKE '%term%'` only with a trigram/full-text index, otherwise prefix match (`term%`) |
| Searchable columns | fixed per endpoint (listed below) – no free column choice |
| Statement timeout | 3 s for search queries; on timeout return 422 `too_broad` ("refine your search") |
| Rate limit | 10 search requests / second / user (429) |

Client side (to add in the app):
- **Debounce 300 ms** after the last keystroke; don't send while the box has only 1 character.
- **Cancel in-flight requests** (`AbortController`) when a new query starts or the tab changes.
- Keep the last 20 query results in memory (keyed by URL) for instant back/forward.
- Date-range guards: NRP / Change Requests / Prices max span **366 days**; Material Planning max **184 days** (explosion cost).

### 4.5 Lazy loading in Glide
- Load the first page on open; give `DataEditor` `rows = total`.
- `getCellContent` returns a loading cell for rows not yet fetched; `onVisibleRegionChanged` triggers fetching the pages that cover the visible rows **± 1 page**; keep at most ~10 pages cached per grid (LRU).
- Grouped grids (Item Master, Material Planning, BOM): first fetch **group summaries** (side → count, subtotal); fetch a group's rows only when it is expanded (each group pages independently).
- Drill-downs (Material Planning models per item) are fetched on expand, never up front.

---

## 5. Endpoints

### 5.1 Session & lookups
| Method | Path | Notes |
|---|---|---|
| GET | `/me` | user, role, permissions, `server_date` |
| GET | `/lookups/months?scope=prices\|nrp` | months that have data (BOM month dropdown) |
| GET | `/vendors?q=&limit=20` | typeahead |
| GET | `/users` · PATCH `/users/{id}` | Admin only – role changes, audited |

### 5.2 Models & BOM
| Method | Path | Notes |
|---|---|---|
| GET | `/models?q=&q=&sort=code&cursor=&limit=100` | Models tab. Search cols: code, material, description, motor, pump, panel, vendor code/name, category |
| GET | `/models/search?q=&limit=20` | BOM sidebar typeahead. Min 2 chars. Matches model fields only; item-code matches via a separate `?item=` flag (uses `bom_lines.item_code` index), **not** full description scan |
| PATCH | `/models/{code}` | `If-Match`; editable: description, motor, pump, panel, vendor_code, category (material/code immutable) |
| GET | `/models/{code}/bom?month=YYYY-MM` | header (rev, vendor, motor/pump/panel) + **group summaries** (side, count, amount) |
| GET | `/models/{code}/bom/lines?side=MOTOR&month=&sort=&cursor=&limit=` | lines with `rate`, `rate_source` (`month`/`carried`/`missing`), `amount` |
| PATCH | `/bom-lines/{id}` | qty – recommended to go through a change request + new `rev` instead |

### 5.3 Materials & change requests
| Method | Path | Notes |
|---|---|---|
| GET | `/materials/groups?q=&q=&month=` | side → count (for group headers) |
| GET | `/materials?side=&q=&q=&month=&sort=&cursor=&limit=` | rows incl. `ver`, `rate`, `rate_source`, `pending: {request_id, fields[]}` |
| GET | `/materials/search?q=&limit=20` | version-history picker / NRP material typeahead |
| GET | `/materials/{code}` | single item |
| GET | `/materials/{code}/versions?cursor=&limit=50` | version history |
| POST | `/change-requests` | **Save** – body `{ lines:[{item_code, field, new_value, base_ver}] }`; appends to the caller's open request (or creates one); returns `{id, revision}`. Server validates field names (Item, Description, UOM, Make, Suppliers, Sub-assembly, Make/Buy, Lead Days), values, and that `base_ver` = current `ver` (409 otherwise) |
| GET | `/change-requests?status=&from=&to=&q=&q=&cursor=&limit=20` | cards; each card includes its lines (cap 200 lines per card, then `lines_truncated: true`) |
| GET | `/change-requests/{id}` | full card |
| GET | `/change-requests/pending-count` | tab badge (poll every 60 s or push via SSE) |
| POST | `/change-requests/{id}/approve` | `If-Match: revision`; Admin, not requester; per line checks `base_ver`; creates versions only for items with Item/Description/UOM/Make lines; single transaction |
| POST | `/change-requests/{id}/reject` | `If-Match: revision`; optional reason |
| POST | `/change-requests/approve` | **Approve all** – body `{ ids:[…], revisions:{id:rev} }`; max 50 per call; returns per-id result |

### 5.4 Prices
| Method | Path | Notes |
|---|---|---|
| GET | `/prices?from=&to=&q=&q=&sort=&cursor=&limit=` | price list; each row has `is_latest` for its item+month (computed in SQL) |
| GET | `/prices/effective?month=&codes=A,B,C` | max 500 codes; used anywhere a rate is needed |
| POST | `/prices` | append one entry (never update/delete; corrections = new entry) |
| POST | `/prices/import` | Excel/CSV upload → validates, returns a preview `{valid, errors}`; `POST /prices/import/{token}/commit` to apply |

### 5.5 NRP
| Method | Path | Notes |
|---|---|---|
| GET | `/nrp?from=&to=&q=&q=&sort=&cursor=&limit=` | rows joined with model description/vendor; response includes `total_qty` for the filter |
| POST | `/nrp/batch` | Save/Discard model: `{ upserts:[{id?, plan_date, material, qty, ver?}], deletes:[{id, ver}] }`; validates material exists, qty ≥ 0, date inside an open planning window |
| POST | `/nrp/import` (+ `/commit`) | Excel import with preview, same as prices |

### 5.6 Material Planning
| Method | Path | Notes |
|---|---|---|
| GET | `/planning/groups?from=&to=&q=&q=` | side → item count |
| GET | `/planning/requirements?from=&to=&side=&q=&q=&sort=&cursor=&limit=` | item rows: `item_code, description, uom, gross_qty` – computed as `SUM(nrp.qty × bom.qty)` in SQL (one aggregate query, indexed) |
| GET | `/planning/requirements/{item_code}/models?from=&to=` | drill-down: `model, assembly_name (Motor/Pump/Panel - …), nrp_qty, qty_per, qty` |

For large plans, keep a cached result per `(from, to, nrp_version)`; invalidate when NRP or a BOM changes.

### 5.7 Dashboard
One row per finished-goods material that has NRP qty in the range; one column group per month.

| Method | Path | Notes |
|---|---|---|
| GET | `/dashboard?from=&to=&q=&q=&sort=&cursor=&limit=100` | **max 24 months** (422 otherwise). Row: `material, description, vendor_code, vendor_name, months:[{month, qty, price_per_piece, change_pct}]`. `price_per_piece` = Σ(BOM qty × effective rate for that month); `change_pct` vs the previous month in the range (null for the first month or when either month has no qty). Paged **by material** (cursor = material code) |
| GET | `/dashboard/totals?from=&to=&q=&q=` | per month: `qty`, `value` (= Σ qty × price_per_piece, in ₹; the UI shows ÷ 1,00,00,000 → "Crs", 1 decimal), `avg_change_pct` (simple average over materials with a value) – computed over the **whole filter**, not just the loaded page |

Server notes
- Price per piece per *(model, month)* is the expensive part: compute once per request with one query (BOM lines ⋈ effective-price view for the months in range) and reuse it for every material of that model; cache keyed by `(model, month, prices_version, bom_rev)`.
- `totals` is a separate call so the grid can show rows while totals load.

### 5.8 Raw materials (commodities) & projection
Projection prices every model from the **latest** prices, adjusted by a % per commodity, for the NRP qty of a chosen period.

| Method | Path | Notes |
|---|---|---|
| GET | `/commodities/summary?month=latest` | **small, ~10–30 rows**: `[{commodity, items, avg_price, ref_uom?, ref_price?}]`. Feeds the ⚙ dialog. **No item lists** – the dialog never fetches per-item data |
| GET | `/projections/me` | the caller's default settings: `{id, from, to, base_month, pcts:{commodity:pct}}` (empty pcts → all 0 %) |
| PUT | `/projections/me` | save settings; validates `-20 ≤ pct ≤ 50` (step 0.5), known commodities, period ≤ 12 months; `If-Match` |
| POST | `/dashboard/projection` | body `{from, to, base_month?, pcts:{…}, q:[…], cursor, limit}` → per material: `qty` (NRP in period), `price_per_piece` (Σ BOM qty × latest rate × (1 + pct/100)), `base_price_per_piece`, `change_pct`; plus `totals {qty, value, avg_change_pct}`. POST because pcts can be long; **read-only**, no data is written |
| GET | `/projections` · POST `/projections` | *(later)* named scenarios ("Copper +8 %", "Budget FY27") shared between users |

Guards
- Recalculate only on **Apply** in the dialog (not on every slider move); the dialog's projected averages are computed in the browser from `avg_price × (1 + pct)`.
- `base_month` defaults to the latest month that has prices; the response echoes it so the UI can show "Base: latest prices (January 2027)".
- Note: `avg_price` mixes units inside a commodity (e.g. copper wire per KG and cable per MTR). It is an indicator only; add `ref_price` (₹/kg) per commodity if a true commodity price is needed.

### 5.9 Exports (replaces browser-side export for big grids)
| Method | Path | Notes |
|---|---|---|
| POST | `/exports` | `{ view:'materials'\|'prices'\|'nrp'\|'planning'\|'models'\|'change-lines'\|'bom'\|'dashboard', filters:{…same params…, projection?:{from,to,pcts}}, columns:[…], include:{header, groups}, format:'xlsx'\|'csv' }` |
| | | ≤ 50 000 rows → streams the file directly; larger → `202 { job_id }` |
| GET | `/exports/{job_id}` · `/exports/{job_id}/file` | status + download; files kept 24 h |

The Ctrl+) dialog keeps "Selected cells only" in the browser (data is already loaded); "All rows" calls `/exports`.
Saving in the browser: use the File System Access "Save As" dialog (`showSaveFilePicker`) where available, else an `<a download>` attached to the page; keep the object URL for ≥ 60 s. For server exports, the endpoint sends `Content-Disposition: attachment; filename="…"` so a plain link works everywhere.

---

## 6. Front-end changes to make with the API
1. A small data layer: `api(path, {signal})` wrapper with auth/error handling, a query cache (e.g. TanStack Query), and a `useDebouncedQuery` hook implementing the 300 ms / min-2-chars / abort rules.
2. A `usePagedRows(endpoint, params)` hook for Glide: row count from `total`, page cache, `onVisibleRegionChanged` prefetch, loading cells.
3. Grouped grids: fetch `…/groups`, then page per expanded group.
4. Replace `ME`, `CURRENT_GRID`, `DRAFT` globals with context; drafts stay client-side until Save.
5. Replace `TODAY` with `me.server_date`.
6. Bundle React, Glide and the Excel writer with Vite for offline LAN hosting.

## 7. Suggested build order
1. Auth + `/me`, users/roles, read-only Models, Materials (paged + search), BOM view with effective prices.
2. Change requests (save, list, approve/reject with version checks) + material versions.
3. Prices list + import; NRP list + batch save + import.
4. Material Planning aggregation + drill-down; Dashboard (rows + totals).
5. Commodities on materials, `/commodities/summary`, projection settings + `/dashboard/projection`.
6. Server-side exports, audit log viewer, SSE for the pending badge.
