import React, { useEffect, useMemo, useState } from 'react'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { PLAN_NAMES, planOverPlanByFY, planOverPlanByRegion, cqnPlanVariance } from '../data/mockData'

const PLANS = PLAN_NAMES.filter(p => p !== 'Actual')
const C = { plan1: '#38bdf8', plan2: '#fb923c', variance: '#f87171', grid: 'rgba(255,255,255,0.05)', tick: '#4a6a85' }

function PlanDropdowns({ planA, planB, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
      {[['planA', planA, 'A'], ['planB', planB, 'B']].map(([key, val, lbl]) => (
        <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <label style={{ fontSize: 9, color: '#3d607a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Plan {lbl}
          </label>
          <select value={val} onChange={e => onChange(key, e.target.value)} className="select-dark">
            {PLANS.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
      ))}
    </div>
  )
}

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <p style={{ fontSize: 10, fontWeight: 700, color: '#38bdf8', marginBottom: 5 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ fontSize: 11, color: p.color, marginBottom: 2 }}>
          {p.name}: <span style={{ fontWeight: 600 }}>{typeof p.value === 'number' && p.value > 99 ? p.value.toLocaleString() : `${p.value}%`}</span>
        </p>
      ))}
    </div>
  )
}

function Visual({ title, children, controls }) {
  return (
    <div className="chart-panel flex-1 min-w-0 flex flex-col gap-2">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#e6f1ff', lineHeight: 1.3 }}>{title}</p>
        {controls}
      </div>
      {children}
    </div>
  )
}

function Visual1({ filters, planA, planB, onPlanChange }) {
  const data = useMemo(() => planOverPlanByFY(filters), [filters])
  return (
    <Visual title="Plan Comparison — Variance % (Fiscal Year)"
      controls={<PlanDropdowns planA={planA} planB={planB} onChange={onPlanChange} />}>
      <ResponsiveContainer width="100%" height={222}>
        <ComposedChart data={data} margin={{ top: 4, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={C.grid} />
          <XAxis dataKey="period" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="l" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false}
            tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
          <YAxis yAxisId="r" orientation="right" tick={{ fill: C.variance, fontSize: 10 }} axisLine={false} tickLine={false}
            tickFormatter={v => `${v}%`} />
          <Tooltip content={<Tip />} cursor={{ fill: 'rgba(56,189,248,0.04)' }} />
          <Legend wrapperStyle={{ fontSize: 10, color: C.tick, paddingTop: 4 }} />
          <ReferenceLine yAxisId="r" y={0} stroke="rgba(255,255,255,0.1)" />
          <Bar yAxisId="l" dataKey="plan1" name={planA} fill={C.plan1} opacity={0.8} radius={[3,3,0,0]} maxBarSize={40} />
          <Bar yAxisId="l" dataKey="plan2" name={planB} fill={C.plan2} opacity={0.8} radius={[3,3,0,0]} maxBarSize={40} />
          <Line yAxisId="r" type="monotone" dataKey="variance" name="Variance %" stroke={C.variance}
            strokeWidth={2} dot={{ r: 3, fill: C.variance, strokeWidth: 0 }} activeDot={{ r: 5 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </Visual>
  )
}

function Visual2({ filters, planA, planB, onPlanChange }) {
  const data = useMemo(() => planOverPlanByRegion(filters), [filters])
  return (
    <Visual title="Region-wise Plan Comparison — Variance %"
      controls={<PlanDropdowns planA={planA} planB={planB} onChange={onPlanChange} />}>
      <ResponsiveContainer width="100%" height={222}>
        <ComposedChart data={data} margin={{ top: 4, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={C.grid} />
          <XAxis dataKey="region" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="l" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false}
            tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
          <YAxis yAxisId="r" orientation="right" tick={{ fill: C.variance, fontSize: 10 }} axisLine={false} tickLine={false}
            tickFormatter={v => `${v}%`} />
          <Tooltip content={<Tip />} cursor={{ fill: 'rgba(56,189,248,0.04)' }} />
          <Legend wrapperStyle={{ fontSize: 10, color: C.tick, paddingTop: 4 }} />
          <ReferenceLine yAxisId="r" y={0} stroke="rgba(255,255,255,0.1)" />
          <Bar yAxisId="l" dataKey="plan1" name={planA} fill={C.plan1} opacity={0.8} radius={[3,3,0,0]} maxBarSize={50} />
          <Bar yAxisId="l" dataKey="plan2" name={planB} fill={C.plan2} opacity={0.8} radius={[3,3,0,0]} maxBarSize={50} />
          <Line yAxisId="r" type="monotone" dataKey="variance" name="Variance %" stroke={C.variance}
            strokeWidth={2} dot={{ r: 3, fill: C.variance, strokeWidth: 0 }} activeDot={{ r: 5 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </Visual>
  )
}

function Visual3({ filters, planA, planB, onPlanChange }) {
  const data = useMemo(() => cqnPlanVariance(filters), [filters])
  return (
    <Visual title="CQN Highest Variance"
      controls={<PlanDropdowns planA={planA} planB={planB} onChange={onPlanChange} />}>
      <div style={{ height: 8 }} />
      <ResponsiveContainer width="100%" height={210}>
        <ComposedChart data={data} layout="vertical"
          margin={{ top: 0, right: 28, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={C.grid} horizontal={false} />
          <XAxis type="number" tick={{ fill: C.tick, fontSize: 9 }} axisLine={false} tickLine={false}
            tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
          <YAxis type="category" dataKey="cqn" tick={{ fill: C.tick, fontSize: 9 }} width={130} axisLine={false} tickLine={false} />
          <Tooltip content={<Tip />} cursor={{ fill: 'rgba(56,189,248,0.04)' }} />
          <Legend wrapperStyle={{ fontSize: 10, color: C.tick, paddingTop: 4 }} />
          <Bar dataKey="plan1" name={planA} fill={C.plan1} opacity={0.8} radius={[0,3,3,0]} maxBarSize={14} />
          <Bar dataKey="plan2" name={planB} fill={C.plan2} opacity={0.8} radius={[0,3,3,0]} maxBarSize={14} />
        </ComposedChart>
      </ResponsiveContainer>
    </Visual>
  )
}

export default function Layer1PlanOverPlan({ filters }) {
  const [plans, setPlans] = useState({ planA: 'AOP_FY26Q4_AA', planB: 'FY27 Q1 APR Plan' })
  const [open, setOpen] = useState(true)
  const handlePlanChange = (key, val) => setPlans(p => ({ ...p, [key]: val }))

  // The top Plan Name filter sets the primary plan (A) shown across all three
  // visuals; each visual can still be overridden independently via its own dropdowns.
  useEffect(() => {
    if (filters.planName && filters.planName !== 'All' && PLANS.includes(filters.planName)) {
      setPlans(p => ({
        planA: filters.planName,
        planB: p.planB !== filters.planName ? p.planB : PLANS.find(pl => pl !== filters.planName) || p.planB,
      }))
    }
  }, [filters.planName])

  return (
    <div style={{ background: '#0c1929', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, overflow: 'hidden' }}>
      <div className="layer-header" onClick={() => setOpen(o => !o)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontSize: 9, fontWeight: 700, color: '#070f1a', background: '#38bdf8',
            borderRadius: 4, padding: '2px 7px', letterSpacing: '0.04em',
          }}>01</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#e6f1ff', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Plan over Plan
          </span>
          <span style={{ fontSize: 10, color: '#3d607a' }}>— variance analysis</span>
        </div>
        <span style={{ fontSize: 11, color: '#38bdf8', transform: open ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s', display: 'inline-block' }}>▲</span>
      </div>
      {open && (
        <div style={{ padding: 12, display: 'flex', gap: 10 }}>
          <Visual1 filters={filters} planA={plans.planA} planB={plans.planB} onPlanChange={handlePlanChange} />
          <Visual2 filters={filters} planA={plans.planA} planB={plans.planB} onPlanChange={handlePlanChange} />
          <Visual3 filters={filters} planA={plans.planA} planB={plans.planB} onPlanChange={handlePlanChange} />
        </div>
      )}
    </div>
  )
}
