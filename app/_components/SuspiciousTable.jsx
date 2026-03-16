"use client"

import { useEffect, useState } from "react"
import axios from "axios"

export default function SuspiciousTransactions({ refreshKey = 0 }) {
    const [rows, setRows]       = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError]     = useState(null)

    useEffect(() => {
        let cancelled = false
        const load = async () => {
            setLoading(true)
            setError(null)
            try {
                const res = await axios.get("http://127.0.0.1:8000/suspicious-transactions")
                if (!cancelled) setRows(res.data)
            } catch (err) {
                console.error(err)
                if (!cancelled) setError("Failed to load suspicious transactions.")
            } finally {
                if (!cancelled) setLoading(false)
            }
        }
        load()
        return () => { cancelled = true }
    }, [refreshKey])

    const riskColor = (prob) => {
        if (prob >= 0.85) return "text-red-500"
        if (prob >= 0.65) return "text-orange-400"
        return "text-yellow-500"
    }

    return (
        <div className="bg-white/90 rounded-2xl border border-white shadow-sm p-5 mt-4">

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 tracking-tight">
                        High Risk Transactions
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {loading ? "Loading…" : `${rows.length} flagged transactions`}
                    </p>
                </div>
                {/* live dot */}
                {!loading && !error && (
                    <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                        Live
                    </span>
                )}
            </div>

            {/* Error */}
            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-500">
                    {error}
                </div>
            )}

            {/* Skeleton */}
            {loading && (
                <div className="animate-pulse space-y-2">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-9 bg-gray-100 rounded-lg" />
                    ))}
                </div>
            )}

            {/* Table */}
            {!loading && !error && (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left py-2 pb-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                                    Amount
                                </th>
                                <th className="text-left py-2 pb-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                                    Sender
                                </th>
                                <th className="text-left py-2 pb-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                                    Receiver
                                </th>
                                <th className="text-right py-2 pb-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                                    Risk
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r) => (
                                <tr key={r.id}
                                    className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                                    <td className="py-2.5 font-semibold text-gray-800">
                                        {r.amount.toLocaleString("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                            maximumFractionDigits: 0,
                                        })}
                                    </td>
                                    <td className="py-2.5 text-gray-600">{r.sender_country}</td>
                                    <td className="py-2.5 text-gray-600">{r.receiver_country}</td>
                                    <td className="py-2.5 text-right">
                                        <span className={`font-semibold ${riskColor(r.risk_probability)}`}>
                                            {(r.risk_probability * 100).toFixed(1)}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Empty state */}
            {!loading && !error && rows.length === 0 && (
                <p className="text-xs text-gray-400 py-8 text-center">
                    No suspicious transactions found.
                </p>
            )}
        </div>
    )
}