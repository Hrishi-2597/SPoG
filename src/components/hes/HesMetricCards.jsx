import React, { useMemo, useState } from 'react'
import {
  ComposedChart, BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import {
  hesCardData, asuByFY, srDbOspByFY, cpasuByFY, ucrByFY, ucrImpactedSrByFY,
} from '../../data/hesData'
import { C, Tip } from './HesChartKit'

const CHART_BOX = { maxWidth: 620, margin: '0 auto' }

function fmt(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return String(n)
}

function StatusPip({ ok }) {
  return (
    <span style={{
      display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
      background: ok ? '#34d399' : '#f87171',
      boxShadow: ok ? '0 0 6px rgba(52,211,153,0.7)' : '0 0 6px rgba(248,113,113,0.7)',
      flexShrink: 0,
    }} />
  )
}

function Card({ icon, label, sublabel, value, sub, trend, onClick, active }) {
  return (
    <button onClick={onClick} className={`card-panel flex-1 min-w-0 text-left flex flex-col${active ? ' active' : ''}`} style={{ cursor: 'pointer', padding: 0, minHeight: 84 }}>
      <div style={{ padding: '8px 12px 6px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 14, lineHeight: 1 }}>{icon}</span>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#e6f1ff', lineHeight: 1.2 }}>{label}</p>
          {sublabel && <p style={{ fontSize: 9, color: '#3d607a', marginTop: 1 }}>{sublabel}</p>}
        </div>
      </div>
      <div style={{ padding: '8px 12px 10px', flex: 1 }}>
        <p className="num" style={{ fontSize: 20, fontWeight: 700, color: '#e6f1ff', lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</p>
        {sub && (
          <p style={{ fontSize: 10, color: '#7fa8cc', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            {trend !== undefined && <StatusPip ok={trend} />}
            {sub}
          </p>
        )}
      </div>
      {active && <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #38bdf8, transparent)', marginTop: 'auto' }} />}
    </button>
  )
}

function AsuTrendChart({ filters }) {
  const data = useMemo(() => asuByFY(filters), [filters])
  return (
    <div style={CHART_BOX}>
      <ResponsiveContainer width="100%" height={210}>
        <LineChart data={data} margin={{ top: 4, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={C.grid} />
          <XAxis dataKey="period" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
          <Tooltip content={<Tip />} cursor={{ fill: 'rgba(56,189,248,0.04)' }} />
          <Legend wrapperStyle={{ fontSize: 10, color: C.tick, paddingTop: 4 }} />
          <Line type="monotone" dataKey="actual" name="ASU Actuals" stroke={C.metric1} strokeWidth={2.5} dot={{ r: 3, fill: C.metric1, strokeWidth: 0 }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function SrDbOspChart({ filters }) {
  const data = useMemo(() => srDbOspByFY(filters), [filters])
  return (
    <div style={CHART_BOX}>
      <ResponsiveContainer width="100%" height={210}>
        <BarChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={C.grid} />
          <XAxis dataKey="period" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
          <Tooltip content={<Tip />} cursor={{ fill: 'rgba(56,189,248,0.04)' }} />
          <Legend wrapperStyle={{ fontSize: 10, color: C.tick, paddingTop: 4 }} />
          <Bar dataKey="db" name="DB" stackId="sr" fill={C.metric1} opacity={0.85} maxBarSize={54} />
          <Bar dataKey="osp" name="OSP" stackId="sr" fill={C.metric2} opacity={0.85} radius={[3,3,0,0]} maxBarSize={54} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function CpasuChart({ filters }) {
  const data = useMemo(() => cpasuByFY(filters), [filters])
  return (
    <div style={CHART_BOX}>
      <ResponsiveContainer width="100%" height={210}>
        <ComposedChart data={data} margin={{ top: 4, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={C.grid} />
          <XAxis dataKey="period" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="l" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
          <YAxis yAxisId="r" orientation="right" tick={{ fill: C.trend, fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip content={<Tip />} cursor={{ fill: 'rgba(56,189,248,0.04)' }} />
          <Legend wrapperStyle={{ fontSize: 10, color: C.tick, paddingTop: 4 }} />
          <Bar yAxisId="l" dataKey="sr" name="SR" fill={C.metric1} opacity={0.85} radius={[3,3,0,0]} maxBarSize={54} />
          <Bar yAxisId="l" dataKey="asu" name="ASU" fill={C.metric2} opacity={0.85} radius={[3,3,0,0]} maxBarSize={54} />
          <Line yAxisId="r" type="monotone" dataKey="cpasu" name="CPASU" stroke={C.trend} strokeWidth={2} dot={{ r: 3, fill: C.trend, strokeWidth: 0 }} activeDot={{ r: 5 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

function CurrentUcrChart({ filters }) {
  const data = useMemo(() => ucrByFY(filters), [filters])
  return (
    <div style={CHART_BOX}>
      <ResponsiveContainer width="100%" height={210}>
        <ComposedChart data={data} margin={{ top: 4, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={C.grid} />
          <XAxis dataKey="period" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="l" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} domain={[0,100]} tickFormatter={v => `${v}%`} />
          <YAxis yAxisId="r" orientation="right" tick={{ fill: C.trend, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
          <Tooltip content={<Tip />} cursor={{ fill: 'rgba(56,189,248,0.04)' }} />
          <Legend wrapperStyle={{ fontSize: 10, color: C.tick, paddingTop: 4 }} />
          <Bar yAxisId="l" dataKey="current" name="Current" fill={C.metric1} opacity={0.85} radius={[3,3,0,0]} maxBarSize={54} />
          <Bar yAxisId="l" dataKey="target" name="Target" fill={C.metric2} opacity={0.85} radius={[3,3,0,0]} maxBarSize={54} />
          <Line yAxisId="r" type="monotone" dataKey="adherence" name="Adherence %" stroke={C.trend} strokeWidth={2} dot={{ r: 3, fill: C.trend, strokeWidth: 0 }} activeDot={{ r: 5 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

function UcrImpactedChart({ filters }) {
  const data = useMemo(() => ucrImpactedSrByFY(filters), [filters])
  return (
    <div style={CHART_BOX}>
      <ResponsiveContainer width="100%" height={210}>
        <BarChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={C.grid} />
          <XAxis dataKey="period" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
          <Tooltip content={<Tip />} cursor={{ fill: 'rgba(56,189,248,0.04)' }} />
          <Legend wrapperStyle={{ fontSize: 10, color: C.tick, paddingTop: 4 }} />
          <Bar dataKey="actualSR" name="Actual SR" stackId="sr" fill={C.metric1} opacity={0.85} maxBarSize={54} />
          <Bar dataKey="srDeflected" name="SR Deflected" stackId="sr" fill={C.behind} opacity={0.85} radius={[3,3,0,0]} maxBarSize={54} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function DrillDownPanel({ type, filters, onClose }) {
  return (
    <div className="animate-fade-in" style={{
      marginTop: 10, background: 'rgba(12,25,41,0.95)', border: '1px solid rgba(56,189,248,0.2)',
      borderRadius: 8, padding: '12px 14px', backdropFilter: 'blur(8px)',
    }}>
      <div style={{ position: 'relative', marginBottom: 10 }}>
        <h3 style={{ fontSize: 12, fontWeight: 700, color: '#38bdf8', textAlign: 'center' }}>
          {type === 'asu'      && 'ASU Actuals Trend'}
          {type === 'sr'       && 'SR Actuals — DB vs OSP'}
          {type === 'cpasu'    && 'SR & ASU with CPASU'}
          {type === 'ucr'      && 'Current UCR vs Target'}
          {type === 'impacted' && 'Actual SR + SR Deflected'}
        </h3>
        <button onClick={onClose} style={{ position: 'absolute', right: 0, top: -1, color: '#3d607a', fontSize: 16, lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
      </div>
      {type === 'asu' && <AsuTrendChart filters={filters} />}
      {type === 'sr' && <SrDbOspChart filters={filters} />}
      {type === 'cpasu' && <CpasuChart filters={filters} />}
      {type === 'ucr' && <CurrentUcrChart filters={filters} />}
      {type === 'impacted' && <UcrImpactedChart filters={filters} />}
    </div>
  )
}

export default function HesMetricCards({ filters }) {
  const [active, setActive] = useState(null)
  const d = useMemo(() => hesCardData(filters), [filters])
  const toggle = key => setActive(prev => prev === key ? null : key)

  return (
    <div style={{ padding: '0 16px 12px' }}>
      <div style={{ display: 'flex', gap: 10 }}>
        <Card icon="📶" label="ASU Actuals" sublabel="Trend over time"
          value={fmt(d.asuActuals.value)}
          sub={`Plan ${fmt(d.asuActuals.plan)} · ${d.asuActuals.adherence}% adherence`}
          trend={d.asuActuals.adherence >= 95}
          onClick={() => toggle('asu')} active={active === 'asu'} />
        <Card icon="🎫" label="SR Actuals" sublabel="DB / OSP handled"
          value={fmt(d.srActuals.value)}
          sub={`Plan ${fmt(d.srActuals.plan)} · ${d.srActuals.adherence}% adherence`}
          trend={d.srActuals.adherence >= 95}
          onClick={() => toggle('sr')} active={active === 'sr'} />
        <Card icon="➗" label="CPASU" sublabel="SR ÷ ASU"
          value={d.cpasu.value.toFixed(2)}
          sub="Cases per ASU — lower is more efficient"
          onClick={() => toggle('cpasu')} active={active === 'cpasu'} />
        <Card icon="🎯" label="Current UCR" sublabel="vs Target"
          value={`${d.currentUcr.value}%`}
          sub={`Target ${d.currentUcr.target}% · ${d.currentUcr.adherence}% adherence`}
          trend={d.currentUcr.adherence >= 95}
          onClick={() => toggle('ucr')} active={active === 'ucr'} />
        <Card icon="↩" label="UCR Impacted SR" sublabel="Deflected volume"
          value={fmt(d.ucrImpactedSr.value)}
          sub={`${d.ucrImpactedSr.total ? Math.round(d.ucrImpactedSr.value / d.ucrImpactedSr.total * 100) : 0}% of total SR`}
          onClick={() => toggle('impacted')} active={active === 'impacted'} />
      </div>

      {active && <DrillDownPanel type={active} filters={filters} onClose={() => setActive(null)} />}
    </div>
  )
}
