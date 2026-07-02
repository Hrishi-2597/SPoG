import React, { useMemo, useState } from 'react'
import {
  ComposedChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import {
  asuSrTrendByFY, asuSrTrendCountries, srBotsByFY, ucrByFY, ucrNonAdherentQueues,
} from '../../data/capacityData'
import { C, Visual, Tip } from './CapacityChartKit'

function RegionCountryToggle({ viewMode, setViewMode, country, setCountry, countries }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 10 }}>
        <span style={{ color: viewMode === 'Country' ? '#38bdf8' : '#3d607a', fontWeight: 500 }}>Country</span>
        <button onClick={() => setViewMode(v => v === 'Region' ? 'Country' : 'Region')}
          style={{ position: 'relative', display: 'inline-flex', alignItems: 'center',
            width: 32, height: 17, borderRadius: 9,
            background: viewMode === 'Region' ? '#38bdf8' : '#1a3050',
            border: 'none', cursor: 'pointer', transition: 'background 0.2s', padding: 0 }}>
          <span style={{ position: 'absolute', top: 2, left: viewMode === 'Region' ? 17 : 2,
            width: 13, height: 13, borderRadius: '50%', background: 'white', transition: 'left 0.2s' }} />
        </button>
        <span style={{ color: viewMode === 'Region' ? '#38bdf8' : '#3d607a', fontWeight: 500 }}>Region</span>
      </div>
      {viewMode === 'Country' && (
        <select value={country} onChange={e => setCountry(e.target.value)} className="select-dark" style={{ fontSize: 10 }}>
          {countries.map(c => <option key={c}>{c}</option>)}
        </select>
      )}
    </div>
  )
}

// "Region" shows the aggregate trend; "Country" scopes the same trend to one country
// via a scale factor rather than maintaining a full parallel per-country dataset.
function Visual1({ filters }) {
  const countries = useMemo(() => asuSrTrendCountries(), [])
  const [viewMode, setViewMode] = useState('Region')
  const [country, setCountry] = useState(countries[0])
  const data = useMemo(
    () => asuSrTrendByFY(filters, viewMode === 'Country' ? country : null),
    [filters, viewMode, country]
  )
  return (
    <Visual title="ASU Impact on SR Trend with CPASU"
      controls={<RegionCountryToggle viewMode={viewMode} setViewMode={setViewMode} country={country} setCountry={setCountry} countries={countries} />}>
      <ResponsiveContainer width="100%" height={222}>
        <ComposedChart data={data} margin={{ top: 4, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={C.grid} />
          <XAxis dataKey="period" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="l" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false}
            tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
          <YAxis yAxisId="r" orientation="right" tick={{ fill: C.trend, fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip content={<Tip />} cursor={{ fill: 'rgba(56,189,248,0.04)' }} />
          <Legend wrapperStyle={{ fontSize: 10, color: C.tick, paddingTop: 4 }} />
          <Bar yAxisId="l" dataKey="asu" name="ASU" fill={C.metric1} opacity={0.8} radius={[3,3,0,0]} maxBarSize={40} />
          <Bar yAxisId="l" dataKey="sr"  name="SR"  fill={C.metric2} opacity={0.8} radius={[3,3,0,0]} maxBarSize={40} />
          <Line yAxisId="r" type="monotone" dataKey="cpasu" name="CPASU" stroke={C.trend}
            strokeWidth={2} dot={{ r: 3, fill: C.trend, strokeWidth: 0 }} activeDot={{ r: 5 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </Visual>
  )
}

function Visual2({ filters }) {
  const data = useMemo(() => srBotsByFY(filters), [filters])
  return (
    <Visual title="UCR Impact on SR">
      <ResponsiveContainer width="100%" height={222}>
        <BarChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={C.grid} />
          <XAxis dataKey="period" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false}
            tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
          <Tooltip content={<Tip />} cursor={{ fill: 'rgba(56,189,248,0.04)' }} />
          <Legend wrapperStyle={{ fontSize: 10, color: C.tick, paddingTop: 4 }} />
          <Bar dataKey="humanSR" name="SR (Human)" stackId="sr" fill={C.metric1} opacity={0.85} maxBarSize={44} />
          <Bar dataKey="botsSR"  name="SR (Bots)"  stackId="sr" fill={C.trend}   opacity={0.85} radius={[3,3,0,0]} maxBarSize={44} />
          <Bar dataKey="plan"    name="SR Plan"    fill={C.metric2} opacity={0.7} radius={[3,3,0,0]} maxBarSize={44} />
        </BarChart>
      </ResponsiveContainer>
    </Visual>
  )
}

function Visual3({ filters }) {
  const data = useMemo(() => ucrByFY(filters), [filters])
  const nonAdherent = useMemo(() => ucrNonAdherentQueues(filters), [filters])
  return (
    <Visual title="UCR Runrate with Target">
      <ResponsiveContainer width="100%" height={150}>
        <ComposedChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={C.grid} />
          <XAxis dataKey="period" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
          <Tooltip content={<Tip />} cursor={{ fill: 'rgba(56,189,248,0.04)' }} />
          <Legend wrapperStyle={{ fontSize: 10, color: C.tick, paddingTop: 4 }} />
          <Bar dataKey="current" name="Runrate" fill={C.metric1} opacity={0.85} radius={[3,3,0,0]} maxBarSize={40} />
          <Line type="monotone" dataKey="target" name="Target" stroke={C.behind} strokeWidth={2} strokeDasharray="4 3"
            dot={{ r: 3, fill: C.behind, strokeWidth: 0 }} />
        </ComposedChart>
      </ResponsiveContainer>
      <p style={{ fontSize: 9.5, color: '#5a8bb0', margin: '6px 0 4px', textAlign: 'center' }}>Queues not adhering to target</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {nonAdherent.map((q, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, padding: '2px 4px' }}>
            <span style={{ color: '#cfe8fb', fontFamily: 'monospace', fontSize: 9.5 }}>{q.name}</span>
            <span style={{ fontWeight: 600, color: C.behind }}>{q.runrate}% <span style={{ color: '#5a8bb0', fontWeight: 400 }}>vs {q.target}%</span></span>
          </div>
        ))}
      </div>
    </Visual>
  )
}

export default function AsuSrTrendLayer({ filters }) {
  const [open, setOpen] = useState(true)

  return (
    <div style={{ background: '#0c1929', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, overflow: 'hidden' }}>
      <div className="layer-header" onClick={() => setOpen(o => !o)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: '#070f1a', background: '#fb923c', borderRadius: 4, padding: '2px 7px', letterSpacing: '0.04em' }}>03</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#e6f1ff', textTransform: 'uppercase', letterSpacing: '0.06em' }}>ASU Impact on SR Trend</span>
          <span style={{ fontSize: 10, color: '#3d607a' }}>— CPASU &amp; UCR runrate</span>
        </div>
        <span style={{ fontSize: 11, color: '#fb923c', transform: open ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s', display: 'inline-block' }}>▲</span>
      </div>
      {open && (
        <div style={{ padding: 12, display: 'flex', gap: 10 }}>
          <Visual1 filters={filters} />
          <Visual2 filters={filters} />
          <Visual3 filters={filters} />
        </div>
      )}
    </div>
  )
}
