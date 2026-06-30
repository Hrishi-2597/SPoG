# Technical Specification — ISG SPoG ESG Forecasting Dashboard

## Overview
A single-page React application that renders an analytics dashboard for Dell's ISG Enterprise Service Group (ESG). It covers Forecast Trend data: call volume plans, actuals vs plan adherence, and geographic accuracy distribution. All data is currently mocked — no backend.

---

## Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| UI Framework | React | 18.3.1 | Component-based rendering |
| Build Tool | Vite | 5.4.2 | Dev server, bundler |
| Styling | Tailwind CSS | 3.4.11 | Utility-first CSS |
| Charts | Recharts | 2.12.7 | Bar, Line, Composed, stacked charts |
| Geo Map | react-simple-maps | 3.0.0 | SVG world map rendering |
| Color Scale | d3-scale | 4.0.2 | Accuracy → color mapping |
| CI/CD | GitHub Actions | — | Auto-build and deploy |
| Hosting | GitHub Pages | — | Static site hosting |
| Deployment Action | peaceiris/actions-gh-pages | v4 | Pushes dist/ to gh-pages branch |

---

## Project Structure

```
SPoG/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD: build → push to gh-pages branch
├── src/
│   ├── main.jsx                # React root mount
│   ├── App.jsx                 # Top-level layout: header + filters + cards + layers
│   ├── index.css               # Tailwind imports + global scrollbar/select styles
│   ├── components/
│   │   ├── FilterPanel.jsx     # 12-dropdown filter bar (2 rows × 6)
│   │   ├── MetricCards.jsx     # 5 KPI cards + drill-down panel
│   │   ├── Layer1PlanOverPlan.jsx  # Plan vs Plan: 3 chart visuals + plan selectors
│   │   ├── Layer2ActualVsPlan.jsx  # Actual vs Plan: 3 chart visuals + stacked bar
│   │   └── Layer3GeoMap.jsx    # World map with accuracy markers + summary table
│   └── data/
│       └── mockData.js         # All static mock data (CQNs, plans, KPIs, geo)
├── index.html                  # Vite entry HTML
├── vite.config.js              # base: '/ISG-SPoG/' for GitHub Pages paths
├── tailwind.config.js          # Custom navy color palette
├── postcss.config.js
├── package.json                # Scripts: dev / build / predeploy / deploy
└── README.md
```

---

## Component Architecture

```
App
├── <header>              — Page title, org label, live indicator
├── FilterPanel           — Controlled: filters state lifted to App
├── MetricCards           — Self-contained; reads CARD_DATA from mockData
│   └── DrillDownPanel    — Inline (within MetricCards), toggled by card click
├── Layer1PlanOverPlan    — Collapsible section
│   ├── Visual1           — ComposedChart: FY/Qtr/Week drill toggle, plan A/B dropdowns
│   ├── Visual2           — ComposedChart: Region x-axis, region↔country toggle
│   └── Visual3           — Horizontal ComposedChart: CQN names
├── Layer2ActualVsPlan    — Collapsible section
│   ├── Visual1           — ComposedChart: Actual/Plan bars + Adherence% line
│   ├── Visual2           — Stacked BarChart: adherence buckets per FY
│   └── Visual3           — Horizontal ComposedChart: CQN with Cell coloring
└── Layer3GeoMap          — Collapsible section
    ├── ComposableMap     — react-simple-maps world SVG
    ├── Markers           — Accuracy circles per region or country
    └── Summary table     — Adherence % with status badges
```

---

## State Management

No external state library. All state is local React `useState`:

| Component | State | Type |
|---|---|---|
| `App` | `filters` | Object (12 filter keys) |
| `MetricCards` | `active` (drill-down) | String or null |
| `Layer1PlanOverPlan` | `plans` (planA/planB), `open` | Object, Boolean |
| `Layer1 Visual1/2/3` | `drill` (FY/Quarter/Week) | String |
| `Layer2ActualVsPlan` | `plan`, `open` | String, Boolean |
| `Layer3GeoMap` | `viewMode` (Region/Country), `hovered`, `open` | String, Object, Boolean |

> Filters are passed as props to layer components but currently all mock data is static (not yet filtered). Wiring filters to data is the next integration step.

---

## Data Model (`src/data/mockData.js`)

### Constants
```
CQN_LIST         — 11 queue names (ISG-ESG-{REGION}-{N})
PLAN_NAMES       — ['Actual', 'Dec Plan', 'Jan Plan', 'Apr Plan', 'May Plan']
FISCAL_YEARS     — ['FY25', 'FY26', 'FY27']
REGIONS          — ['AMER', 'EMEA', 'APJ', 'LATAM']
COUNTRIES        — { AMER: [...], EMEA: [...], APJ: [...], LATAM: [...] }
```

### Card Data
```
CARD_DATA        — { totalQueues, callVolume, dbOspSplit, forecastAccuracy, cqnVariance }
ACTIVE_QUEUES    — Array<{ name, region, offered, handled, accuracy }>
```

### Layer 1 Data (Plan over Plan)
```
PLAN_VS_PLAN_BY_FY      — period, plan1, plan2, variance (computed getter)
PLAN_VS_PLAN_BY_QTR     — same shape, 4 quarters
PLAN_VS_PLAN_BY_WEEK    — same shape, 13 weeks
PLAN_VS_PLAN_BY_REGION  — region, plan1, plan2, variance
PLAN_VS_PLAN_BY_CQN     — cqn (short name), plan1, plan2, variance
```

### Layer 2 Data (Actual vs Plan)
```
ACTUAL_VS_PLAN_BY_FY    — period, actual, plan, adherence (computed getter)
ACTUAL_VS_PLAN_BY_QTR   — same shape, 4 quarters
ACTUAL_VS_PLAN_BY_WEEK  — same shape, 13 weeks
STACKED_ADHERENCE       — fy, excellent, good, fair, poor (% buckets)
ACTUAL_VS_PLAN_BY_CQN   — cqn, actual, plan, variance
```

### Layer 3 Data (Geo)
```
GEO_REGION_DATA   — { region, accuracy, lat, lng, label }  ×4 regions
GEO_COUNTRY_DATA  — { country, region, accuracy, lat, lng } ×14 countries
```

---

## Build & Deployment

### Local build
```bash
npm run build   # → dist/ folder
```
Vite sets `base: '/ISG-SPoG/'` so all asset paths include the repo name prefix.

### CI/CD (`.github/workflows/deploy.yml`)
```
Trigger: push to main OR manual workflow_dispatch
Steps:
  1. checkout
  2. setup-node@v4 (node 20, npm cache)
  3. npm ci
  4. npm run build
  5. peaceiris/actions-gh-pages@v4 → pushes dist/ to gh-pages branch
```

### GitHub Pages config (manual, one-time)
- Settings → Pages → Source: `Deploy from a branch` → Branch: `gh-pages` → `/(root)`

---

## External Dependencies at Runtime

| Resource | URL | Used by |
|---|---|---|
| World GeoJSON | `https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json` | Layer3GeoMap |

---

## Known Limitations

1. Filters are UI-only — no data filtering logic wired yet
2. All data is mock/static — no API endpoints
3. 682KB bundle (recharts + react-simple-maps) — consider dynamic imports
4. No authentication, no role-based views
5. No mobile/responsive layout optimisation (designed for 1280px+ screens)
