# Prompt Trail — ISG SPoG Project

Chronological log of every user prompt and the corresponding actions taken.

---

## Prompt 1 — 2026-06-30
**Input:** `/model` (set model to Sonnet 4.6 1M context)
**Action:** Model set, no code changes.

---

## Prompt 2 — 2026-06-30
**Input:** `so can you read the ppt in @SPOG_views.pptx and understand it?`

**Action:**
- Located `SPOG_views.pptx` via Glob
- Extracted text from all 16 slides by unzipping the PPTX (ZIP format) and regex-parsing `<a:t>` XML tags via PowerShell
- Parsed and summarized 3 dashboard domains:
  1. Call Center / WFM Analytics (slides 1–9)
  2. Forecast Trend Dashboard (slides 10–13)
  3. Shipment Trend Dashboard (slides 14–16)
- Documented key terminology: CQN, DB/OSP, ASU, SR, UCR, SLO, LOB, FTE, CPASU, AOP

---

## Prompt 3 — 2026-06-30
**Input:** `This is SPoG for ISG Business and particular for Enterprise Service Group(ESG) Forecasting Page and we want to built an interactive UI and also check for GIT credentials.` *(with git init commands and 2 screenshot images)*

**Images provided:** Screenshots of the ESG Forecasting design spec showing filter panel layout, 5 KPI cards, Layer 1 (Plan over Plan) and Layer 2 (Actual vs Plan) graph layouts.

**Action:**
- Checked git credentials: user=`Hrishi-2597`, email=`hrishikesh.yadav@alignedautomation.com`
- Confirmed Node v24 / npm v11 available
- Scaffolded full React + Vite project manually (no create-vite, all files written directly)
- Created project structure:
  ```
  src/
    components/FilterPanel.jsx
    components/MetricCards.jsx
    components/Layer1PlanOverPlan.jsx
    components/Layer2ActualVsPlan.jsx
    components/Layer3GeoMap.jsx
    data/mockData.js
    App.jsx  main.jsx  index.css
  package.json  vite.config.js  tailwind.config.js
  postcss.config.js  index.html  .gitignore
  ```
- Installed dependencies via `npm install`
- Built successfully (`vite build` → 682KB bundle, no errors)
- `git init`, created README.md, committed, set remote to `https://github.com/Hrishi-2597/ISG-SPoG.git`
- Pushed to GitHub (`main` branch)

---

## Prompt 4 — 2026-06-30
**Input:** `when everything is built push to github pages and setup everything deploy it and give the hosted link in the chat`

**Action:**
- Set `vite.config.js` base to `/ISG-SPoG/` for correct asset paths
- Added `predeploy` / `deploy` scripts to `package.json`
- Created `.github/workflows/deploy.yml` using `actions/configure-pages@v4` + `actions/deploy-pages@v4`
- Fixed `Layer3GeoMap.jsx`: removed `ZoomableGroup` (removed in react-simple-maps v3)
- Pushed to GitHub → Actions workflow triggered and completed with `success`
- Verified HTTP 200 at `https://hrishi-2597.github.io/ISG-SPoG/`
- **Issue discovered:** site served raw source `index.html` (with `src="/src/main.jsx"`) — GitHub Pages was still set to "Deploy from branch: main", not GitHub Actions

---

## Prompt 5 — 2026-06-30
**Input:** `The link is not loading on website`

**Action:**
- Diagnosed: `https://hrishi-2597.github.io/ISG-SPoG/` returned raw source `<script src="/src/main.jsx">` instead of compiled assets
- Root cause: GitHub Pages was configured to serve from `main` branch (raw files), not the Actions artifact
- Fix: updated workflow to use `peaceiris/actions-gh-pages@v4` which pushes `dist/` to `gh-pages` branch
- Verified `gh-pages` branch was created with correct built `index.html` (`src="/ISG-SPoG/assets/index-KRutg-Ok.js"`)
- Pages workflow completed with `success`
- Remaining step for user: go to Settings → Pages → Source → `gh-pages` branch

---

## Prompt 6 — 2026-06-30
**Input:** `create a handoff.md, create prompt_trail.md create tech_spec.md, create design_choice.md and keep it updated as each prompt is given keep on updating`

**Action:**
- Created this file (`prompt_trail.md`) and three companion docs
- All 4 files placed in project root (`C:\...\Desktop\SPoG\`)
- Committed to git and pushed

---

<!-- NEW PROMPTS APPENDED BELOW THIS LINE -->
