# Project Handoff — ISG SPoG ESG Forecasting Dashboard

## Current State (as of 2026-06-30)

### What is this?
A React-based Single Pane of Glass (SPoG) analytics dashboard for Dell's ISG Business — specifically the Enterprise Service Group (ESG) Forecasting Page. It visualizes call-center WFM metrics: plan comparisons, actual vs plan adherence, and geo-based accuracy across regions.

### Live URL
**https://hrishi-2597.github.io/ISG-SPoG/**
> GitHub Pages is configured to serve from the `gh-pages` branch (built artifacts).
> Settings path: https://github.com/Hrishi-2597/ISG-SPoG/settings/pages → Source: `gh-pages` branch / `/(root)`

### Repository
https://github.com/Hrishi-2597/ISG-SPoG
- `main` branch — source code
- `gh-pages` branch — compiled `dist/` output (auto-updated by CI)

---

## How to Run Locally

```bash
npm install
npm run dev
# → http://localhost:5173
```

## How to Deploy

Push any commit to `main` — GitHub Actions (`.github/workflows/deploy.yml`) automatically:
1. Runs `npm ci && npm run build`
2. Pushes `dist/` to `gh-pages` branch via `peaceiris/actions-gh-pages@v4`
3. GitHub Pages serves the updated build within ~60s

---

## What's Built

| Feature | File | Status |
|---|---|---|
| 12-filter panel (CQN, Plan, FY, Region, etc.) | `src/components/FilterPanel.jsx` | ✅ Done |
| 5 KPI cards with drill-down tables | `src/components/MetricCards.jsx` | ✅ Done |
| Layer 1: Plan over Plan (3 visuals) | `src/components/Layer1PlanOverPlan.jsx` | ✅ Done |
| Layer 2: Actual vs Plan (3 visuals) | `src/components/Layer2ActualVsPlan.jsx` | ✅ Done |
| Layer 3: Geo Map (world map + table) | `src/components/Layer3GeoMap.jsx` | ✅ Done |
| Mock data (FY25–FY27, 11 CQNs, 14 countries) | `src/data/mockData.js` | ✅ Done |
| GitHub Actions CI/CD | `.github/workflows/deploy.yml` | ✅ Done |

---

## What's NOT Yet Built (from PPT scope)

These are in the original SPOG_views.pptx but not yet implemented:
- Slides 3–4: Staffing / Headcount dashboard (SL%, FTE, Attrition, Utilization)
- Slides 5–6: ASU / SR / UCR layer
- Slides 7–9: Workload distribution, SLO heatmaps
- Slides 10–13: Full Forecast Trend page (MAPE, Bias%, queue exception table)
- Slides 14–16: Shipment Trend page (Consumer/Commercial/Enterprise)
- AI-generated RCA & CLCA panel (mentioned in PPT)
- Real backend / data connection (currently all mock data)

---

## Known Issues / Pending

1. **GitHub Pages source must be manually set** to `gh-pages` branch after first deploy (one-time step).
2. **Geo map** fetches world GeoJSON from CDN (`cdn.jsdelivr.net/npm/world-atlas@2`) — requires internet at runtime.
3. All data is **mock/static** — no API or database connection yet.
4. Chunk size warning (682KB bundle) — consider code-splitting recharts and react-simple-maps in future.

---

## Git Credentials
- User: `Hrishi-2597`
- Email: `hrishikesh.yadav@alignedautomation.com`
- Remote: `https://github.com/Hrishi-2597/ISG-SPoG.git`
