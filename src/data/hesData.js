// Mock data + selectors for the HES Forecasting page (ASU / SR / UCR).
// Structurally mirrors mockData.js (multi-select filters as arrays, FY-level charts
// narrowed by the most specific time filter, real names paired with illustrative
// numbers) but is a fully separate module — HES Forecasting has its own filter set
// and metrics, and keeping it decoupled avoids any risk to the ESG Forecasting page.
import {
  FISCAL_YEARS, FISCAL_QUARTERS, FISCAL_WEEK_LIST, BUSINESS_PARTNERS, REGIONS,
  ACTIVE_QUEUE_NAMES, regionForCountry, matchesMulti,
} from './mockData'

// Real Dell ISG product/technology lines (business-supplied).
export const LOB_LIST = [
  'Avamar', 'BSAFE', 'Connectivity', 'DataDomain', 'DLM', 'DPA', 'DPSolutions',
  'E2E Connectivity', 'Enterprise', 'GIST', 'Global Solutions', 'High End Storage',
  'Hyperconverged', 'Integrated_Software', 'Mainframe', 'Midrange', 'Networker',
  'Networking', 'OBJ', 'Powerflex', 'PowerProtect', 'PowerProtect Cyber', 'PowerScale',
  'RecoverPoint', 'RPS', 'Server', 'Storage', 'Symmetrix', 'SymmSW', 'VCF', 'Vplex',
  'Wipro', 'XtremIO',
]

export const GLOBAL_GROUPING_LIST = ['Consumer', 'Commercial', 'Enterprise']

// Fiscal Month filter options: FY25M01 ... FY27M12 — this page adds Month as a time
// filter granularity that Forecasting doesn't have.
export const FISCAL_MONTH_LIST = FISCAL_YEARS.flatMap(fy =>
  Array.from({ length: 12 }, (_, i) => `${fy}M${String(i + 1).padStart(2, '0')}`)
)

const HES_FILTER_KEYS = ['lob', 'businessPartner', 'globalGrouping']
const HES_FIELD_BY_KEY = { lob: 'lob', businessPartner: 'businessPartner', globalGrouping: 'globalGrouping' }

// Week > Month > Quarter > Year precedence, same idea as Forecasting's effectiveFiscalYears,
// extended with the extra Month granularity this page's filter bar has.
export function hesEffectiveFiscalYears(filters = {}) {
  const picked = (filters.fiscalWeek?.length && filters.fiscalWeek)
    || (filters.fiscalMonth?.length && filters.fiscalMonth)
    || (filters.fiscalQuarter?.length && filters.fiscalQuarter)
    || (filters.fiscalYear?.length && filters.fiscalYear)
  if (!picked) return FISCAL_YEARS
  return FISCAL_YEARS.filter(fy => picked.some(v => v.slice(0, 4) === fy))
}

// ── LOB fact table ───────────────────────────────────────────────────────────
// Every LOB gets a deterministic businessPartner/globalGrouping tag (round-robin,
// same "real names, illustrative structure" approach as the Forecasting queue table)
// so the LOB/Business Partner/Global Grouping filters have something genuine to narrow.
export const LOB_FACTS = LOB_LIST.map((lob, i) => ({
  lob,
  businessPartner: BUSINESS_PARTNERS[i % BUSINESS_PARTNERS.length],
  globalGrouping: GLOBAL_GROUPING_LIST[i % GLOBAL_GROUPING_LIST.length],
}))

export function filterLobs(filters = {}) {
  return LOB_FACTS.filter(l =>
    HES_FILTER_KEYS.every(key => matchesMulti(filters[key], l[HES_FIELD_BY_KEY[key]]))
  )
}

// Scale factor applied to every FY-level metric below: shrinks proportionally to how
// many LOBs the current filters leave in scope, same "volume tracks queue count" logic
// Forecasting's callVolumeByFY uses.
function lobScopeRatio(filters) {
  const total = LOB_FACTS.length
  return total ? filterLobs(filters).length / total : 0
}

// ── ASU & SR baselines ───────────────────────────────────────────────────────
const BASE_ASU = { FY25: 18000, FY26: 21000, FY27: 24000 }
const BASE_SR  = { FY25: 9500,  FY26: 11000, FY27: 12800 }

export const ASU_BY_FY = FISCAL_YEARS.map(fy => ({
  period: fy,
  plan: BASE_ASU[fy],
  actual: Math.round(BASE_ASU[fy] * (0.90 + Math.random() * 0.08)),
  get adherence() { return +((this.actual / this.plan) * 100).toFixed(1) },
}))

export const SR_BY_FY = FISCAL_YEARS.map(fy => ({
  period: fy,
  plan: BASE_SR[fy],
  actual: Math.round(BASE_SR[fy] * (0.90 + Math.random() * 0.08)),
  get adherence() { return +((this.actual / this.plan) * 100).toFixed(1) },
}))

export const ASU_PLAN_VS_PLAN_BY_FY = FISCAL_YEARS.map(fy => ({
  period: fy,
  plan1: BASE_ASU[fy],
  plan2: Math.round(BASE_ASU[fy] * (0.93 + Math.random() * 0.1)),
  get variance() { return +((this.plan2 - this.plan1) / this.plan1 * 100).toFixed(1) },
}))

export const SR_PLAN_VS_PLAN_BY_FY = FISCAL_YEARS.map(fy => ({
  period: fy,
  plan1: BASE_SR[fy],
  plan2: Math.round(BASE_SR[fy] * (0.93 + Math.random() * 0.1)),
  get variance() { return +((this.plan2 - this.plan1) / this.plan1 * 100).toFixed(1) },
}))

export function asuByFY(filters = {}) {
  const years = hesEffectiveFiscalYears(filters)
  const ratio = lobScopeRatio(filters)
  return ASU_BY_FY.filter(d => years.includes(d.period))
    .map(d => ({ ...d, plan: Math.round(d.plan * ratio), actual: Math.round(d.actual * ratio) }))
}

export function srByFY(filters = {}) {
  const years = hesEffectiveFiscalYears(filters)
  const ratio = lobScopeRatio(filters)
  return SR_BY_FY.filter(d => years.includes(d.period))
    .map(d => ({ ...d, plan: Math.round(d.plan * ratio), actual: Math.round(d.actual * ratio) }))
}

export function asuPlanVsPlanByFY(filters = {}) {
  const years = hesEffectiveFiscalYears(filters)
  const ratio = lobScopeRatio(filters)
  return ASU_PLAN_VS_PLAN_BY_FY.filter(d => years.includes(d.period))
    .map(d => ({ period: d.period, plan1: Math.round(d.plan1 * ratio), plan2: Math.round(d.plan2 * ratio), variance: d.variance }))
}

export function srPlanVsPlanByFY(filters = {}) {
  const years = hesEffectiveFiscalYears(filters)
  const ratio = lobScopeRatio(filters)
  return SR_PLAN_VS_PLAN_BY_FY.filter(d => years.includes(d.period))
    .map(d => ({ period: d.period, plan1: Math.round(d.plan1 * ratio), plan2: Math.round(d.plan2 * ratio), variance: d.variance }))
}

// ── CPASU (= SR / ASU) ─────────────────────────────────────────────────────
export function cpasuByFY(filters = {}) {
  const asu = asuByFY(filters)
  const sr = srByFY(filters)
  return asu.map((a, i) => ({
    period: a.period, asu: a.actual, sr: sr[i].actual,
    cpasu: a.actual ? +(sr[i].actual / a.actual).toFixed(2) : 0,
  }))
}

// ── UCR (current vs target) ──────────────────────────────────────────────────
const BASE_UCR_TARGET = { FY25: 82, FY26: 85, FY27: 88 }

export const UCR_BY_FY = FISCAL_YEARS.map(fy => ({
  period: fy,
  target: BASE_UCR_TARGET[fy],
  current: +(BASE_UCR_TARGET[fy] * (0.92 + Math.random() * 0.06)).toFixed(1),
  get adherence() { return +((this.current / this.target) * 100).toFixed(1) },
}))

export function ucrByFY(filters = {}) {
  const years = hesEffectiveFiscalYears(filters)
  return UCR_BY_FY.filter(d => years.includes(d.period))
}

// ── UCR-impacted SR (actual SR + SR deflected) ────────────────────────────────
export function ucrImpactedSrByFY(filters = {}) {
  const sr = srByFY(filters)
  return sr.map((d, i) => ({
    period: d.period,
    actualSR: d.actual,
    srDeflected: Math.round(d.actual * (0.08 + i * 0.01)),
  }))
}

// ── SR handled by Bots vs humans, plus SR Plan (Layer 3 "UCR Impact on SR") ───
export function srBotsByFY(filters = {}) {
  const sr = srByFY(filters)
  return sr.map(d => {
    const botsSR = Math.round(d.actual * 0.35)
    return { period: d.period, humanSR: d.actual - botsSR, botsSR, plan: d.plan }
  })
}

// ── DB/OSP split of SR actuals (SR Actuals card drill-down) ───────────────────
export function srDbOspByFY(filters = {}) {
  const sr = srByFY(filters)
  return sr.map(d => {
    const db = Math.round(d.actual * 0.7)
    return { period: d.period, db, osp: d.actual - db }
  })
}

// ── Real per-LOB queue lists (business-supplied) ──────────────────────────────
// Only "High End Storage" has real data so far; other LOBs fall back to a generic
// cross-LOB sample (Forecasting's queue list) until their real lists arrive.
export const LOB_QUEUES = {
  'High End Storage': {
    active: [
      'APJ DPD AVAMAR', 'APJ DPD AVAMAR Chinese', 'APJ DPD DataDomain', 'APJ DPD DataDomain Chinese',
      'APJ DPD Networker', 'APJ DPD Networker Chinese', 'APJ HES Connectivity Chinese', 'APJ HES CST Chinese',
      'APJ HES Integrated_Software Chinese', 'APJ HES MIDRANGE Chinese', 'APJ HES MIDRANGE Japanese',
      'APJ HES Symmetrix Chinese', 'APJ HES Symmetrix Japanese', 'APJ HES Symmetrix Korean',
      'APJ HES SymmSW Chinese', 'APJ HES Vplex Chinese', 'APJ HES XtremIO', 'APJ UDS PowerScale Chinese',
      'APJ UDS PowerScale Japanese', 'EMEA DPD AVAMAR', 'EMEA DPD DataDomain', 'EMEA DPD Networker',
      'EMEA UDS PowerScale', 'Global Compute Hardware', 'Global Connectivity Backline', 'Global Connectivity FL',
      'Global DLM Backline', 'GLOBAL DPD AVAMAR', 'GLOBAL DPD DataDomain', 'GLOBAL DPD DPA',
      'GLOBAL DPD DPSolutions', 'GLOBAL DPD Networker', 'GLOBAL DPD PowerProtect', 'Global DPD PowerProtect Cyber',
      'GLOBAL DPD RecoverPoint', 'Global ESG Midrange Backline', 'GLOBAL HES Integrated_Software',
      'GLOBAL HES MIDRANGE Backline', 'Global HES Midrange FL', 'Global Integrated Software FL',
      'Global Mainframe Backline', 'Global Networking', 'Global PowerEdge DSE', 'Global Solutions HCI DE',
      'Global Solutions MS DE', 'Global Symmetrix Backline', 'Global Symmetrix FL', 'Global Symmetrix SW FL',
      'Global SymmSW Backline', 'Global TELCO', 'GLOBAL UDS OBJ', 'GLOBAL UDS PowerScale',
      'Global Vplex Backline', 'Global Vplex FL', 'Global VxRail', 'Global VxRail Domain Engineer',
      'HCS APJ VxRail Chinese', 'HCS APJ VxRail Japanese', 'HCS APJ VxRail Korean', 'HCS LATAM BRZ VxRail',
      'HCS LATAM MMCLA VxRail', 'LATAM Avamar Portuguese', 'LATAM Avamar Spanish', 'LATAM DataDomain Portuguese',
      'LATAM DataDomain Spanish', 'LATAM ECS Portuguese', 'LATAM ECS Spanish', 'LATAM Networker Portuguese',
      'LATAM Networker Spanish', 'LATAM PowerScale Portuguese', 'LATAM PowerScale Spanish',
      'LATAM Primary Storage Portuguese', 'LATAM Primary Storage Spanish', 'NAMER DPD AVAMAR',
      'NAMER DPD DataDomain', 'NAMER DPD Networker', 'NAMER UDS PowerScale', 'RPS Remote Proactive Services',
    ],
    inactive: [
      'AMER English Avamar', 'AMER English Connectivity', 'AMER English DataDomain',
      'AMER English Integrated Software', 'AMER English Networker', 'AMER English OBJ',
      'AMER English PowerScale', 'AMER English VMAX', 'AMER English Vplex', 'AMER English XtremIO',
      'ANZ Midrange Storage VNX/e', 'ANZ VX Rail Storage', 'APJ DPD DPSolutions', 'APJ DPD DPSolutions Chinese',
      'APJ English Midrange', 'APJ English PowerScale', 'APJ English VXRail', 'APJ HES Connectivity',
      'APJ HES Integrated_Software', 'APJ HES MIDRANGE', 'APJ HES Symmetrix', 'APJ HES SymmSW',
      'APJ HES Vplex', 'APJ UDS OBJ', 'APJ UDS PowerScale', 'CCC HES VXRail Hyperconverged',
      'CCC Midrange Storage VNX/e', 'CCC VX Rail Storage', 'EMEA English Avamar', 'EMEA English Connectivity',
      'EMEA English DataDomain', 'EMEA English Integrated Software', 'EMEA English Networker',
      'EMEA English OBJ', 'EMEA English PowerScale', 'EMEA English VMAX', 'EMEA English Vplex',
      'EMEA English XtremIO', 'EMEA HES Connectivity', 'EMEA HES Integrated_Software', 'EMEA HES MIDRANGE',
      'EMEA HES Symmetrix', 'EMEA HES SymmSW', 'EMEA HES Vplex', 'EMEA HES XtremIO', 'EMEA PowerScale CTE',
      'EMEA UDS OBJ', 'French Midrange', 'French VXRail', 'German Midrange', 'German VXRail',
      'GLOBAL DPD Cloudboost', 'GLOBAL DPD DPADSRT', 'GLOBAL DPD SOURCEONE', 'GLOBAL HES MIDRANGE',
      'GLOBAL HES XtremIO', 'Global VxRail CTE', 'HCS APJ VxRail', 'HCS APJ VxRail English NAMER AOH',
      'HCS EMEA VxRail', 'HCS Global APEX', 'HCS Global Cloud Solutions', 'HCS Global Converged',
      'HCS Global PowerFlex', 'HCS Global Solutions', 'HCS Global Vmware', 'HCS Global VxRail',
      'HCS INDIA VxRail', 'HCS LATAM VxRail', 'HCS NAMER VxRail', 'HES Global AVAMAR', 'HES Global Cloudboost',
      'HES Global Connectivity', 'HES Global CST Chat', 'HES Global DataDomain', 'HES Global DLM',
      'HES Global DPA', 'HES Global DPADSRT', 'HES Global DPSolutions', 'HES Global DPSolutions WIPRO',
      'HES Global E2E CONNECTIVITY', 'HES Global Hyperconverged', 'HES Global Mainframe',
      'HES Global Networker', 'HES Global OBJ', 'HES Global PowerScale', 'HES Global PowerScale Support',
      'HES Global RecoverPoint', 'HES Global RecoverPoint WIPRO', 'HES Global Solutions',
      'HES Global SOURCEONE', 'HES Global SSG', 'HES Global SymmSW', 'HES Global VMAX', 'HES Global Vplex',
      'HES Global XtremIO', 'IND Midrange Storage VNX/e', 'India DPD AVAMAR', 'India DPD DataDomain',
      'India DPD Networker', 'India HES Connectivity', 'India HES Integrated_Software', 'INDIA HES MIDRANGE',
      'India HES SymmSW', 'India HES Vplex', 'India HES XtremIO', 'India UDS OBJ', 'India UDS PowerScale',
      'Italian Midrange', 'JP Midrange Storage VNX/e', 'JP VX Rail Storage', 'LATAM DPD AVAMAR',
      'LATAM DPD DataDomain', 'LATAM DPD DPA', 'LATAM DPD Networker', 'LATAM HES MIDRANGE',
      'LATAM HES Symmetrix', 'LATAM HES SymmSW', 'LATAM UDS OBJ', 'LATAM UDS PowerScale',
      'Midrange Storage VNX/e', 'MMCLA Midrange Storage VNX/e', 'MMCLA Midrange Storage VNX/e Spanish',
      'MMCLA VXRail Spanish', 'NA Midrange Storage VNX/e', 'NA PowerScale HE Storage Voice',
      'NA VX Rail Storage', 'NAMER HES Connectivity', 'NAMER HES Integrated_Software', 'NAMER HES MIDRANGE',
      'NAMER HES Symmetrix', 'NAMER HES SymmSW', 'NAMER HES Vplex', 'NAMER HES XtremIO', 'NAMER UDS OBJ',
      'POR Midrange Storage VNX/e', 'Spanish Midrange', 'Spanish VXRail', 'UKI Midrange', 'UKI VXRail', 'VXRail',
    ],
  },
}

// ── Queues not adhering to UCR target ─────────────────────────────────────────
// Prefers a LOB's real queue list (currently only High End Storage) when that LOB
// is the one selected; otherwise falls back to a generic cross-LOB sample from the
// Forecasting queue list, tagged with a below-target runrate for this drill-down.
const NON_ADHERENT_FALLBACK = ACTIVE_QUEUE_NAMES.slice(0, 40)
export function ucrNonAdherentQueues(filters = {}, count = 5) {
  const years = hesEffectiveFiscalYears(filters)
  const fy = years[years.length - 1] || 'FY27'
  const target = UCR_BY_FY.find(d => d.period === fy)?.target ?? 85
  const offset = FISCAL_YEARS.indexOf(fy) * count

  const selectedLobWithData = filters.lob?.find(l => LOB_QUEUES[l])
  const pool = selectedLobWithData ? LOB_QUEUES[selectedLobWithData].active : NON_ADHERENT_FALLBACK

  return Array.from({ length: count }, (_, i) => {
    const name = pool[(offset + i * 7) % pool.length]
    const runrate = +(target - (4 + ((offset + i) % 9))).toFixed(1)
    return { name, runrate, target }
  })
}

// ── Plan Impact Analysis: region-level Plan A/B + LOB contribution ────────────
// Deck specifies exactly these 3 regions for this visual (not the full 5-region set
// used elsewhere) — kept as its own constant rather than reusing REGIONS.
export const IMPACT_REGIONS = ['NAMER', 'EMEA', 'APJ']

function buildRegionPlans(base) {
  return IMPACT_REGIONS.map((region, i) => ({
    region,
    planA: Math.round(base * (0.85 - i * 0.15)),
    planB: Math.round(base * (0.80 - i * 0.14)),
  }))
}
export const ASU_REGION_PLANS = buildRegionPlans(BASE_ASU.FY27)
export const SR_REGION_PLANS = buildRegionPlans(BASE_SR.FY27)

function buildLobImpact(base) {
  const byRegion = {}
  IMPACT_REGIONS.forEach((region, ri) => {
    byRegion[region] = LOB_LIST.map((lob, i) => {
      // 17 is coprime with the prime modulus 131, so i -> i*17 mod 131 is injective
      // over i = 0..32 — every LOB gets a distinct residue (and thus a distinct delta)
      // within a given region, instead of collapsing into a handful of repeated values.
      const residue = (i * 17 + ri * 41) % 131
      const delta = Math.round(base * 0.10 * ((residue - 65) / 65))
      return { lob, delta }
    }).sort((a, b) => a.delta - b.delta)
  })
  return byRegion
}
const ASU_LOB_IMPACT_BY_REGION = buildLobImpact(BASE_ASU.FY27)
const SR_LOB_IMPACT_BY_REGION = buildLobImpact(BASE_SR.FY27)

export function asuRegionPlans(filters = {}) {
  return ASU_REGION_PLANS
}
export function srRegionPlans(filters = {}) {
  return SR_REGION_PLANS
}
export function asuLobImpact(region, count = 6) {
  return (ASU_LOB_IMPACT_BY_REGION[region] || []).slice(0, count)
}
export function srLobImpact(region, count = 6) {
  return (SR_LOB_IMPACT_BY_REGION[region] || []).slice(0, count)
}

// ── ASU impact on SR Trend (Layer 3, Visual 1) — Region/Country toggle ────────
// "Country" mode scopes the same FY trend to one representative country via a scale
// factor, rather than maintaining a full parallel per-country dataset.
const TREND_COUNTRIES = ['United States', 'United Kingdom', 'Germany', 'India', 'Japan', 'Australia', 'Brazil']
const COUNTRY_SCALE = Object.fromEntries(TREND_COUNTRIES.map((c, i) => [c, 0.08 + (i % 4) * 0.05]))
export function asuSrTrendCountries() {
  return TREND_COUNTRIES
}
export function asuSrTrendByFY(filters = {}, country = null) {
  const scale = country ? (COUNTRY_SCALE[country] ?? 0.15) : 1
  return cpasuByFY(filters).map(d => ({
    period: d.period,
    asu: Math.round(d.asu * scale),
    sr: Math.round(d.sr * scale),
    cpasu: d.cpasu,
  }))
}

// ── Geo Map: LOB adherence by region (choropleth, reuses Forecasting's country lookup) ─
function lobAdherenceValue(regionIndex, lobIndex) {
  return 65 + ((regionIndex * 7 + lobIndex * 11) % 30)
}
export function geoAdherenceByRegion(filters = {}) {
  const activeLobs = filters.lob?.length ? filters.lob : LOB_LIST
  return REGIONS.map((region, ri) => {
    const values = activeLobs.map(lob => lobAdherenceValue(ri, LOB_LIST.indexOf(lob)))
    const adherence = Math.round(values.reduce((a, b) => a + b, 0) / values.length)
    return { region, adherence, label: region }
  })
}
export { regionForCountry }

// ── Card headlines ─────────────────────────────────────────────────────────
// Latest in-scope fiscal year's snapshot for each of the 5 KPI cards.
export function hesCardData(filters = {}) {
  const asu = asuByFY(filters)
  const sr = srByFY(filters)
  const ucr = ucrByFY(filters)
  const impacted = ucrImpactedSrByFY(filters)
  const cpasu = cpasuByFY(filters)
  const latestAsu = asu[asu.length - 1]
  const latestSr = sr[sr.length - 1]
  const latestUcr = ucr[ucr.length - 1]
  const latestImpacted = impacted[impacted.length - 1]
  const latestCpasu = cpasu[cpasu.length - 1]
  return {
    asuActuals: { value: latestAsu?.actual ?? 0, plan: latestAsu?.plan ?? 0, adherence: latestAsu?.adherence ?? 0 },
    srActuals: { value: latestSr?.actual ?? 0, plan: latestSr?.plan ?? 0, adherence: latestSr?.adherence ?? 0 },
    cpasu: { value: latestCpasu?.cpasu ?? 0 },
    currentUcr: { value: latestUcr?.current ?? 0, target: latestUcr?.target ?? 0, adherence: latestUcr?.adherence ?? 0 },
    ucrImpactedSr: { value: latestImpacted?.srDeflected ?? 0, total: latestImpacted?.actualSR ?? 0 },
  }
}
