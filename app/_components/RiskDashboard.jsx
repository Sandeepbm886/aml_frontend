"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie,
    Legend,
} from "recharts"
import { Skeleton } from "./Skeleton"

/* ─── palette ─────────────────────────────────────── */
const HIGH_COLOR = "#f87171"   // red-400
const LOW_COLOR  = "#34d399"   // emerald-400
const BAR_COLOR  = "#6366f1"   // indigo-500
const BAR_HIGH   = "#f87171"   // red-400 for top bar

/* ─── custom tooltip for bar chart ───────────────── */
const CountryTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
        <div className="rounded-xl border border-white/10 bg-[#13172a]/95 backdrop-blur-md px-3.5 py-2.5 shadow-xl shadow-black/40 text-xs">
            <p className="font-semibold text-white/90 mb-1">{label}</p>
            <p className="text-white/50">
                Suspicious txns:{" "}
                <span className="font-bold text-white">{payload[0].value}</span>
            </p>
        </div>
    )
}

/* ─── custom label inside pie slice ──────────────── */
const PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180
    const r = innerRadius + (outerRadius - innerRadius) * 0.55
    const x = cx + r * Math.cos(-midAngle * RADIAN)
    const y = cy + r * Math.sin(-midAngle * RADIAN)
    return percent > 0.05 ? (
        <text
            x={x} y={y}
            fill="#fff"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={11}
            fontWeight={700}
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    ) : null
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════ */
const RiskDashboard = ({ refreshKey = 0 }) => {
    const [countryData, setCountryData] = useState([])
    const [distribution, setDistribution] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true)
            setError(null)
            try {
                const [cRes, dRes] = await Promise.all([
                    axios.get("http://127.0.0.1:8000/country-risk"),
                    axios.get("http://127.0.0.1:8000/risk-distribution"),
                ])
                const sorted = [...cRes.data].sort(
                    (a, b) => b.suspicious_transactions - a.suspicious_transactions
                )
                setCountryData(sorted)
                setDistribution(dRes.data)
            } catch (err) {
                console.error(err)
                setError("Failed to load analytics data.")
            } finally {
                setLoading(false)
            }
        }
        fetchAll()
    }, [refreshKey])

    const pieData = distribution
        ? [
            { name: "High Risk", value: distribution.high_risk, fill: HIGH_COLOR },
            { name: "Low Risk",  value: distribution.low_risk,  fill: LOW_COLOR  },
        ]
        : []

    const total = distribution ? distribution.high_risk + distribution.low_risk : 0
    const maxVal = countryData.length
        ? Math.max(...countryData.map((d) => d.suspicious_transactions))
        : 0

    return (
        <div className="w-full space-y-4">

            {/* ── section header ──────────────────────────── */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-semibold text-white/90">Risk Analytics</h2>
                    <p className="text-[11px] text-white/40 mt-0.5">Live overview of transaction risk signals</p>
                </div>
                {!loading && !error && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] text-white/50">Live data</span>
                    </div>
                )}
            </div>

            {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400">
                    {error}
                </div>
            )}

            {/* ── two cards ───────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* ── Risk Distribution (Pie) ─────────────── */}
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.04] backdrop-blur-sm p-5">
                    <div className="mb-4">
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
                            Risk Distribution
                        </p>
                        {distribution && (
                            <p className="text-xs text-white/30 mt-0.5">
                                {total.toLocaleString()} total transactions
                            </p>
                        )}
                    </div>

                    {loading ? (
                        <div className="animate-pulse space-y-3">
                            <div className="mx-auto w-[140px] h-[140px] rounded-full bg-white/[0.06]" />
                            <div className="flex gap-2 mt-3">
                                <div className="flex-1 h-14 rounded-xl bg-white/[0.05]" />
                                <div className="flex-1 h-14 rounded-xl bg-white/[0.05]" />
                            </div>
                        </div>
                    ) : distribution ? (
                        <>
                            <ResponsiveContainer width="100%" height={190}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={54}
                                        outerRadius={82}
                                        paddingAngle={3}
                                        dataKey="value"
                                        labelLine={false}
                                        label={<PieLabel />}
                                    >
                                        {pieData.map((entry) => (
                                            <Cell key={entry.name} fill={entry.fill} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Legend
                                        iconType="circle"
                                        iconSize={7}
                                        formatter={(value) => (
                                            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
                                                {value}
                                            </span>
                                        )}
                                    />
                                    <Tooltip
                                        formatter={(value, name) => [value, name]}
                                        contentStyle={{
                                            borderRadius: "12px",
                                            border: "1px solid rgba(255,255,255,0.08)",
                                            background: "rgba(13,17,34,0.95)",
                                            color: "rgba(255,255,255,0.85)",
                                            fontSize: "12px",
                                            boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>

                            {/* stat pills */}
                            <div className="flex gap-2 mt-1">
                                <div className="flex-1 rounded-xl bg-red-500/10 border border-red-500/15 px-3 py-2.5 text-center">
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-red-400/70 mb-1">High Risk</p>
                                    <p className="text-xl font-bold text-red-400 leading-none">
                                        {distribution.high_risk.toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex-1 rounded-xl bg-emerald-500/10 border border-emerald-500/15 px-3 py-2.5 text-center">
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-400/70 mb-1">Low Risk</p>
                                    <p className="text-xl font-bold text-emerald-400 leading-none">
                                        {distribution.low_risk.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </>
                    ) : null}
                </div>

                {/* ── Country Risk (Bar) ──────────────────── */}
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.04] backdrop-blur-sm p-5">
                    <div className="mb-4">
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
                            Suspicious Txns by Country
                        </p>
                        {countryData.length > 0 && (
                            <p className="text-xs text-white/30 mt-0.5">
                                {countryData.length} countries flagged
                            </p>
                        )}
                    </div>

                    {loading ? (
                        <div className="animate-pulse space-y-2 pt-1">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-7 rounded-lg bg-white/[0.05]" />
                            ))}
                        </div>
                    ) : countryData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={230}>
                            <BarChart
                                data={countryData}
                                layout="vertical"
                                margin={{ top: 0, right: 12, left: 0, bottom: 0 }}
                                barCategoryGap="32%"
                            >
                                <XAxis
                                    type="number"
                                    allowDecimals={false}
                                    tick={{ fontSize: 10, fill: "rgba(255,255,255,0.25)" }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    type="category"
                                    dataKey="country"
                                    width={70}
                                    tick={{ fontSize: 11, fill: "rgba(255,255,255,0.45)" }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    content={<CountryTooltip />}
                                    cursor={{ fill: "rgba(255,255,255,0.03)" }}
                                />
                                <Bar
                                    dataKey="suspicious_transactions"
                                    radius={[0, 5, 5, 0]}
                                    maxBarSize={18}
                                >
                                    {countryData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={
                                                entry.suspicious_transactions >= maxVal
                                                    ? BAR_HIGH
                                                    : BAR_COLOR
                                            }
                                            fillOpacity={entry.suspicious_transactions >= maxVal ? 0.9 : 0.7}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        !error && (
                            <p className="text-xs text-white/30 pt-4 text-center">
                                No country data available.
                            </p>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}

export default RiskDashboard
