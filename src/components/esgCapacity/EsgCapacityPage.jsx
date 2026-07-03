import React, { useState } from 'react'
import EsgCapacityFilterPanel from './EsgCapacityFilterPanel'
import EsgCapacityMetricCards from './EsgCapacityMetricCards'
import HeadcountLayer from './HeadcountLayer'
import PlanOverPlanVariationLayer from './PlanOverPlanVariationLayer'
import UtilizationLayer from './UtilizationLayer'
import EsgCapacityGeoMap from './EsgCapacityGeoMap'
import EsgCapacityRcaClcaPanel from './EsgCapacityRcaClcaPanel'
import SectionDivider from '../SectionDivider'

const DEFAULT_FILTERS = {
  combinedQueueName: [],
  capacityCode: [],
  planName: [],
  fiscalYear: [],
  fiscalQuarter: [],
  fiscalWeek: [],
  channel: [],
  businessPartner: [],
  region: [],
  subRegion: [],
  dbOsp: 'DB',
}

export default function EsgCapacityPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [granularity, setGranularity] = useState(null)

  return (
    <>
      <EsgCapacityFilterPanel filters={filters} onChange={setFilters} granularity={granularity} onGranularityChange={setGranularity} />

      <SectionDivider label="Key Metrics" />
      <EsgCapacityMetricCards filters={filters} granularity={granularity} />

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, paddingRight: 16 }}>
        <div className="flex-1 min-w-0">
          <SectionDivider label="Analysis Layers" />
          <div className="px-4 pb-4 flex flex-col gap-3">
            <HeadcountLayer filters={filters} granularity={granularity} />
            <PlanOverPlanVariationLayer filters={filters} granularity={granularity} />
            <UtilizationLayer filters={filters} granularity={granularity} />
            <EsgCapacityGeoMap filters={filters} />
          </div>
        </div>

        <div style={{ width: 300, flexShrink: 0, position: 'sticky', top: 14, marginTop: 14 }}>
          <EsgCapacityRcaClcaPanel />
        </div>
      </div>
    </>
  )
}
