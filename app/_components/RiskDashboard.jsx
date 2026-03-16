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
const HIGH_COLOR = "#ef4444"   // red-500
const LOW_COLOR = "#22c55e"   // green-500
const BAR_COLOR = "#374151"   // gray-700

/* ─── custom tooltip for bar chart ───────────────── */
const CountryTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
        <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-md text-xs">
            <p className="font-semibold text-gray-700">{label}</p>
            <p className="text-gray-500 mt-0.5">
                Suspicious txns:{" "}
                <span className="font-bold text-gray-900">{payload[0].value}</span>
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
            className="text-xs font-semibold"
            fontSize={11}
            fontWeight={700}
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    ) : null
}

/* ─── skeleton loader ─────────────────────────────── */


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
                // sort descending for a cleaner bar chart
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

    /* pie data derived from distribution */
    const pieData = distribution
        ? [
            { name: "High Risk", value: distribution.high_risk, fill: HIGH_COLOR },
            { name: "Low Risk", value: distribution.low_risk, fill: LOW_COLOR },
        ]
        : []

    const total = distribution
        ? distribution.high_risk + distribution.low_risk
        : 0

    return (
        <div className="w-full space-y-4 py-5">

            {/* ── header ─────────────────────────────────── */}
            <div className="bg-gray-50 p-5 rounded-2xl">
                <h2 className="text-base font-semibold text-gray-900">Risk Analytics</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                    Live overview of transaction risk signals
                </p>
            </div>

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
                    {error}
                </div>
            )}

            {/* ── two cards side-by-side ──────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* ── Risk Distribution (Pie) ─────────────── */}
                <Card className="bg-white border-gray-200 text-gray-900">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold text-gray-700">
                            Risk Distribution
                        </CardTitle>
                        {distribution && (
                            <p className="text-xs text-gray-400">
                                {total} total transactions analysed
                            </p>
                        )}
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <Skeleton />
                        ) : distribution ? (
                            <>
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={52}
                                            outerRadius={80}
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
                                            iconSize={8}
                                            formatter={(value) => (
                                                <span className="text-xs text-gray-600">{value}</span>
                                            )}
                                        />
                                        <Tooltip
                                            formatter={(value, name) => [value, name]}
                                            contentStyle={{
                                                borderRadius: "8px",
                                                border: "1px solid #e5e7eb",
                                                fontSize: "12px",
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>

                                {/* inline stat pills */}
                                <div className="flex gap-2 mt-2">
                                    <div className="flex-1 rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-center">
                                        <p className="text-xs text-red-400 uppercase tracking-widest">High</p>
                                        <p className="text-lg font-bold text-red-600">
                                            {distribution.high_risk}
                                        </p>
                                    </div>
                                    <div className="flex-1 rounded-lg bg-green-50 border border-green-100 px-3 py-2 text-center">
                                        <p className="text-xs text-green-500 uppercase tracking-widest">Low</p>
                                        <p className="text-lg font-bold text-green-600">
                                            {distribution.low_risk}
                                        </p>
                                    </div>
                                </div>
                            </>
                        ) : null}
                    </CardContent>
                </Card>

                {/* ── Country Risk (Bar) ──────────────────── */}
                <Card className="bg-white border-gray-200 text-gray-900">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold text-gray-700">
                            Suspicious Transactions by Country
                        </CardTitle>
                        {countryData.length > 0 && (
                            <p className="text-xs text-gray-400">
                                {countryData.length} countries flagged
                            </p>
                        )}
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <Skeleton />
                        ) : countryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={240}>
                                <BarChart
                                    data={countryData}
                                    layout="vertical"
                                    margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
                                    barCategoryGap="30%"
                                >
                                    <XAxis
                                        type="number"
                                        allowDecimals={false}
                                        tick={{ fontSize: 11, fill: "#9ca3af" }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        type="category"
                                        dataKey="country"
                                        width={72}
                                        tick={{ fontSize: 11, fill: "#6b7280" }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip content={<CountryTooltip />} cursor={{ fill: "#f3f4f6" }} />
                                    <Bar
                                        dataKey="suspicious_transactions"
                                        radius={[0, 4, 4, 0]}
                                        maxBarSize={20}
                                    >
                                        {countryData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    entry.suspicious_transactions >=
                                                        Math.max(...countryData.map((d) => d.suspicious_transactions))
                                                        ? HIGH_COLOR
                                                        : BAR_COLOR
                                                }
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            !error && (
                                <p className="text-xs text-gray-400 pt-4 text-center">
                                    No country data available.
                                </p>
                            )
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default RiskDashboard
