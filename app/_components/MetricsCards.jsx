"use client"

import { useEffect, useState } from "react"
import axios from "axios"

const CARD_CONFIG = {
    high_risk: { label: "High Risk", color: "text-red-500",   bg: "bg-red-50",   border: "border-red-100"   },
    low_risk:  { label: "Low Risk",  color: "text-green-500", bg: "bg-green-50", border: "border-green-100" },
}

export default function MetricsCards({ refreshKey = 0 }) {
    const [data, setData]       = useState([])   // ← always an array
    const [loading, setLoading] = useState(true)
    const [error, setError]     = useState(null)

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            setError(null)
            try {
                const res = await axios.get("http://127.0.0.1:8000/risk-distribution")

                // API returns { high_risk: 4, low_risk: 3 }
                // Convert to [{ key: "high_risk", count: 4 }, ...]
                const asArray = Object.entries(res.data).map(([key, count]) => ({
                    key,
                    count,
                }))
                setData(asArray)
            } catch (err) {
                console.error(err)
                setError("Failed to load analytics data.")
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [refreshKey])

    if (loading) return (
        <div className="grid grid-cols-2 gap-4">
            {[0, 1].map(i => (
                <div key={i} className="bg-white rounded-xl p-4 shadow animate-pulse h-20" />
            ))}
        </div>
    )

    if (error) return (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-500">
            {error}
        </div>
    )

    return (
        <div className="grid grid-cols-2 gap-4">
            {data.map(({ key, count }) => {
                const cfg = CARD_CONFIG[key] ?? { label: key, color: "text-gray-700", bg: "bg-white", border: "border-gray-100" }
                return (
                    <div key={key} className={`rounded-xl border ${cfg.border} ${cfg.bg} p-4 shadow-sm`}>
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                            {cfg.label}
                        </p>
                        <p className={`text-2xl font-bold mt-1 ${cfg.color}`}>
                            {count}
                        </p>
                    </div>
                )
            })}
        </div>
    )
}