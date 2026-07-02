import React, { useState } from 'react'
import CapacityFilterPanel from './CapacityFilterPanel'
import CapacityMetricCards from './CapacityMetricCards'
import AsuLayer from './AsuLayer'
import SrLayer from './SrLayer'
import AsuSrTrendLayer from './AsuSrTrendLayer'
import CapacityGeoMap from './CapacityGeoMap'
import SectionDivider from '../SectionDivider'

// Every filter is multi-select: [] means "no selection = All" — same convention as
// the Forecasting page's filters.
const DEFAULT_FILTERS = {
  lob: [],
  fiscalYear: [],
  fiscalQuarter: [],
  fiscalMonth: [],
  fiscalWeek: [],
  businessPartner: [],
  globalGrouping: [],
}

export default function CapacityPlanningPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  return (
    <>
      <CapacityFilterPanel filters={filters} onChange={setFilters} />

      <SectionDivider label="Key Metrics" />
      <CapacityMetricCards filters={filters} />

      <SectionDivider label="Analysis Layers" />
      <div className="px-4 pb-4 flex flex-col gap-3">
        <AsuLayer filters={filters} />
        <SrLayer filters={filters} />
        <AsuSrTrendLayer filters={filters} />
        <CapacityGeoMap filters={filters} />
      </div>
    </>
  )
}
