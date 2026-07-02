import React, { useState } from 'react'
import FilterPanel from './FilterPanel'
import MetricCards from './MetricCards'
import Layer1PlanOverPlan from './Layer1PlanOverPlan'
import Layer2ActualVsPlan from './Layer2ActualVsPlan'
import Layer3GeoMap from './Layer3GeoMap'
import RcaClcaPanel from './RcaClcaPanel'
import SectionDivider from './SectionDivider'

// Every filter below is multi-select: [] means "no selection = All". DB/OSP alone stays
// a single string since it's a 3-way segmented pill, not a searchable dropdown.
const DEFAULT_FILTERS = {
  cqn:            [],
  capacityCode:   [],
  planName:       [],
  fiscalYear:     [],
  fiscalQuarter:  [],
  fiscalWeek:     [],
  channel:        [],
  businessPartner:[],
  region:         [],
  subRegion:      [],
  l5Manager:      [],
  dbOsp:          'DB',
}

export default function ForecastingPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  return (
    <>
      {/* ── Filters ──────────────────────────────────────────────── */}
      <FilterPanel filters={filters} onChange={setFilters} />

      {/* ── KPI Cards — full width, cards sit alone here ────────────── */}
      <SectionDivider label="Key Metrics" />
      <MetricCards filters={filters} />

      {/* ── Analysis Layers + RCA/CLCA sidebar ──────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, paddingRight: 16 }}>
        <div className="flex-1 min-w-0">
          <SectionDivider label="Analysis Layers" />
          <div className="px-4 pb-4 flex flex-col gap-3">
            <Layer1PlanOverPlan filters={filters} />
            <Layer2ActualVsPlan filters={filters} />
            <Layer3GeoMap filters={filters} />
          </div>
        </div>

        <div style={{ width: 300, flexShrink: 0, position: 'sticky', top: 14, marginTop: 14 }}>
          <RcaClcaPanel />
        </div>
      </div>
    </>
  )
}
