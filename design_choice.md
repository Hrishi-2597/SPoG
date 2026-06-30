# Design Choices — ISG SPoG ESG Forecasting Dashboard

A record of every significant design decision made, with the reasoning behind it.

---

## Visual Design

### Color Palette — Dark Navy Theme
**Decision:** Custom navy palette (`navy-900` → `navy-400`) with `#4fc3f7` accent.
```
navy-900: #0d1b2a  ← page background
navy-800: #112240  ← panel/section background
navy-700: #1a3456  ← filter bar, layer headers
navy-600: #1e3f6e  ← card bodies, chart backgrounds
navy-500: #2a5298  ← card headers
accent:   #4fc3f7  ← highlights, actuals bars, line charts
```
**Why:** Matches the dark navy theme shown in the PPT screenshots. Dark backgrounds reduce eye strain in ops-center environments and make colored chart data pop clearly.

### Typography
**Decision:** `'Segoe UI', system-ui, sans-serif` — no custom font loaded.
**Why:** Avoids a network request, matches Windows/Dell corporate environments, and renders crisply at small sizes (10–12px labels in chart axes).

### Text Size Strategy
- Filter labels: 10px uppercase tracking-wide
- Card titles: 11px bold
- Chart axis ticks: 9–10px
- Section headers: 12px bold uppercase
**Why:** Dense dashboard — space is at a premium. Labels need to be readable but not compete with chart data.

---

## Layout

### Three-column graph layout (all 3 visuals side by side)
**Decision:** Each graph layer renders its 3 visuals in a `flex gap-3` row.
**Why:** Directly mirrors the PPT design spec which shows Visual 1, 2, 3 side-by-side. Maximises horizontal screen real estate for comparison.

### Collapsible layers (accordion)
**Decision:** Each layer (1/2/3) has a clickable header that toggles content visibility.
**Why:** Lets users focus on one layer at a time. All 3 open simultaneously would be ~1200px tall and require constant scrolling.

### Filter panel — 2 rows × 6 columns
**Decision:** 12 filters laid out in a `grid-cols-6` grid inside the filter bar.
**Why:** Exactly matches the PPT screenshot layout (6 filters per row). Keeps the filter panel compact (two rows) so it doesn't eat into chart space.

### Left-side section labels ("Cards", "Graphs")
**Decision:** Removed the vertical text labels from the PPT spec — not included in the UI.
**Why:** They were design-annotation labels in the spec document (for explaining the mockup to stakeholders), not actual UI elements. Including them would look odd in a real app.

---

## Component Decisions

### Filters lifted to App.jsx
**Decision:** `filters` state lives in `App`, passed down as props.
**Why:** All 3 layers + cards need to respond to the same filter state. Lifting to the nearest common ancestor avoids prop drilling through multiple layers and makes filter-to-data wiring straightforward when real data is connected.

### Drill-down as inline panel (not modal)
**Decision:** Clicking a KPI card opens a panel directly below the cards row, not a modal overlay.
**Why:** Modals interrupt workflow. An inline panel lets the user see both the card value and the detail table simultaneously without losing context of other cards.

### Drill toggle (FY / Quarter / Week) as segmented control
**Decision:** Three-button segmented control per visual instead of a dropdown.
**Why:** Users switch frequently between fiscal granularities. One-click toggle is faster than open-select-close. The options are fixed (only 3), so a segmented control is appropriate.

### Plan A / Plan B as separate dropdowns per visual
**Decision:** Each visual in Layer 1 has its own Plan A / Plan B selector.
**Why:** PPT spec explicitly states "2 dropdowns at the top right of each graph to select two different plans." Independent per-visual allows comparing different plan pairs across visuals simultaneously.

### Layer 2 Visual 2 — stacked bar (not grouped)
**Decision:** Stacked 100% bar chart showing adherence buckets (Excellent/Good/Fair/Poor) per fiscal year.
**Why:** The PPT screenshot shows a stacked percentage chart (FY25/26/27 with % breakdowns like 43%/36%/9%/13%). Stacked format communicates the distribution of queues across performance tiers, which grouped bars would obscure.

### CQN chart orientation — horizontal bars
**Decision:** Visual 3 in both Layer 1 and Layer 2 uses a horizontal (layout="vertical") bar chart.
**Why:** CQN names like `ISG-ESG-AMER-01` are long strings — they fit naturally on the Y axis. Vertical bars with CQN names on the X axis would require angled labels and wasted space.

---

## Chart Library

### Recharts (not Chart.js or Victory)
**Decision:** Recharts v2.12.
**Why:**
- Native React component model (no imperative canvas API)
- `ComposedChart` natively supports bars + lines on dual Y-axes — exactly what Plan vs Variance and Actual vs Adherence require
- Good TypeScript support, active maintenance
- Lighter than Victory, more customisable than nivo for this use case

### react-simple-maps (not Leaflet or Mapbox)
**Decision:** react-simple-maps v3 with world-atlas topojson from CDN.
**Why:**
- Pure SVG — no tile server, no API key, no map token required
- Lightweight and renders within the React tree
- `ComposableMap` + `Geographies` + `Marker` pattern is straightforward for dropping accuracy indicators on regions/countries
- Leaflet would add ~150KB and requires a separate CSS file + imperative setup

### Dual Y-axis on all ComposedCharts
**Decision:** Left Y-axis = volume (call counts), Right Y-axis = percentage (variance/adherence).
**Why:** Volume values (20K–300K) and percentage values (−10% to +10%) are on completely different scales. A single Y-axis would flatten the line into near-zero.

---

## Accuracy Color Scale (Geo Map)

| Range | Color | Label |
|---|---|---|
| ≥ 90% | `#2e7d32` (dark green) | Excellent |
| 80–90% | `#1976d2` (blue) | Good |
| 70–80% | `#e65100` (orange) | Fair |
| < 70% | `#b71c1c` (dark red) | Critical |

**Why:** Traffic-light metaphor extended to 4 bands. Green/blue/orange/red maps intuitively to performance tiers. Blue for "Good" (not yellow) avoids green/yellow/red colorblindness issues (deuteranopia).

---

## CI/CD Design

### peaceiris/actions-gh-pages over actions/deploy-pages
**Decision:** Switched from `actions/configure-pages + actions/deploy-pages@v4` to `peaceiris/actions-gh-pages@v4`.
**Why:**
- `actions/deploy-pages` requires GitHub Pages to be set to "GitHub Actions" as source — this is a manual repo setting that isn't auto-applied when Pages was already configured to deploy from a branch
- `peaceiris/actions-gh-pages` pushes the `dist/` output to a `gh-pages` branch, which works with the classic "Deploy from branch" Pages setup
- More predictable — the `gh-pages` branch is visible in the repo, easy to inspect and debug

### vite base = '/ISG-SPoG/'
**Decision:** Set `base: '/ISG-SPoG/'` in `vite.config.js`.
**Why:** GitHub Pages serves project sites (non-org/non-custom-domain) under `/<repo-name>/`. Without this base, all asset paths (`/assets/index.js`) resolve to the root domain and return 404.

---

---

## UI Overhaul (2026-06-30) — Changes Applied

### Font: Space Grotesk
**Decision:** Replaced `Segoe UI, system-ui` with Space Grotesk (Google Fonts, 300–700 weight range).
**Why:** Segoe UI is a neutral system font with no personality. Space Grotesk is geometric and slightly technical — it signals "data tool" without feeling cold. `font-variant-numeric: tabular-nums` applied globally so all numbers in tables and cards align in columns.

### Signature Element: Luminous Card Top-Edge Glow
**Decision:** CSS `::before` pseudo-element on every KPI card — a `linear-gradient(90deg, transparent, #38bdf8, transparent)` line at the top that fans out (left/right bounds expand) and increases opacity on hover; full-width with box-shadow glow when active.
**Why:** Operations dashboards need to communicate "this data is live". The glow treatment makes cards feel like illuminated data panels without adding animation overhead. It's the one memorable thing in the design — everything else is quiet.

### Filter Dropdowns: Dark `.select-dark`
**Decision:** Removed `bg-white text-gray-800` from filter selects. Created `.select-dark` CSS class: `background: #0c1929`, accent-colored SVG chevron, translucent border, focus ring.
**Why:** White dropdowns in a dark dashboard are a visual scream. This was the single biggest regression in the original design.

### Layer Headers: Accent Left-Border + Numbered Badges
**Decision:** Each layer has a `2px solid #38bdf8` left border, horizontal gradient background, and a colored number badge (`01` in accent blue, `02` in teal-green, `03` in orange).
**Why:** The original `Layer 1 / Layer 2 / Layer 3` labels had no visual weight. The numbered badge creates hierarchy and lets the eye navigate to sections quickly. Three different badge colors distinguish the layers at a glance.

### Chart Panels: `.chart-panel` Dark Inset
**Decision:** Chart visual containers now use `background: #0a1522` (darker than the layer surface) with `border: 1px solid rgba(255,255,255,0.06)`.
**Why:** Creates visible depth — the layer container → chart panel → chart itself has three distinct tonal levels. Charts no longer float on flat surfaces.

### Pill DrillToggle
**Decision:** FY/Quarter/Week segmented control changed from rectangular box buttons to a pill container with rounded buttons. Active state: `background: #38bdf8; color: #070f1a`.
**Why:** The rectangle toggle had no roundness and looked like a table row. The pill form is a standard pattern for mutually-exclusive quick filters and reads as interactive at a glance.

### Recharts Axis Cleanup
**Decision:** Removed `axisLine` and `tickLine` from all XAxis/YAxis. Reduced CartesianGrid to `rgba(255,255,255,0.05)` strokeDasharray `2 4`. Added `maxBarSize` cap on all bars.
**Why:** Axis lines double-draw the chart border and add visual noise. With a dark background, tick marks alone are sufficient for reference. Capping bar size prevents bars from becoming wall-to-wall at low data counts.

### Tooltip: Backdrop Blur + Accent Border
**Decision:** `.chart-tooltip` uses `backdrop-filter: blur(8px)`, `background: rgba(12,25,41,0.96)`, `border: 1px solid rgba(56,189,248,0.25)`.
**Why:** Glassmorphism on the tooltip keeps it legible without completely blocking the chart behind it. The accent border connects it visually to the hovered data point.

### Geo Map Marker Glow
**Decision:** SVG `filter: drop-shadow(0 0 6px <color>)` on each accuracy circle, with glow intensity matching the accuracy color (green/blue/orange/red).
**Why:** Plain colored circles on a dark map are hard to find at small sizes. The drop-shadow creates a halo that draws the eye to marker locations without requiring larger circles.

---

## What Was Deliberately NOT Done

| Thing skipped | Reason |
|---|---|
| Redux / Zustand for state | Overkill for current scope; local useState is sufficient |
| TypeScript | Not requested; JS keeps iteration fast |
| Unit tests | Not requested at this stage |
| Backend API | Out of scope — placeholder for real data integration |
| Mobile responsive layout | Dashboard is designed for ops-center / desktop screens (1280px+) |
| Code splitting | Bundle size (682KB) is acceptable for internal tool; can be optimised later |
| Custom font | Avoided extra network request; Segoe UI is already on Windows machines |
