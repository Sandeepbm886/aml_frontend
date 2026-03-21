"use client"

import { useEffect, useState } from "react"
import axios from "axios"

export default function SuspiciousTransactions({ refreshKey = 0 }) {
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        let cancelled = false
        const load = async () => {
            setLoading(true)
            setError(null)
            try {
                const res = await axios.get("https://aml-backend-hyt6.onrender.com/suspicious-transactions")
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

    const riskBadge = (prob) => {
        if (prob >= 0.85)
            return {
                cls: "bg-red-500/15 border border-red-500/25 text-red-400",
                label: "Critical",
            }
        if (prob >= 0.65)
            return {
                cls: "bg-orange-500/15 border border-orange-500/25 text-orange-400",
                label: "High",
            }
        return {
            cls: "bg-yellow-500/15 border border-yellow-500/25 text-yellow-400",
            label: "Medium",
        }
    }

    return (
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.04] backdrop-blur-sm overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                <div>
                    <h3 className="text-sm font-semibold text-white/90 tracking-tight">
                        Flagged Transactions
                    </h3>
                    <p className="text-[11px] text-white/35 mt-0.5">
                        {loading ? "Loading…" : `${rows.length} high-risk transactions detected`}
                    </p>
                </div>
                {!loading && !error && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                        <span className="text-[10px] font-medium text-red-400">Live</span>
                    </div>
                )}
            </div>

            {/* Error */}
            {error && (
                <div className="mx-5 mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400">
                    {error}
                </div>
            )}

            {/* Skeleton */}
            {loading && (
                <div className="p-5 animate-pulse space-y-2">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-10 bg-white/[0.04] rounded-xl" />
                    ))}
                </div>
            )}

            {/* Table */}
            {!loading && !error && rows.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/[0.05]">
                                {["Amount", "Sender", "Receiver", "Risk Score", "Level"].map((h, i) => (
                                    <th
                                        key={h}
                                        className={`px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-white/30 ${i >= 3 ? "text-right" : "text-left"
                                            }`}
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r, idx) => {
                                const badge = riskBadge(r.risk_probability)
                                return (
                                    <tr
                                        key={r.id}
                                        className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors group"
                                    >
                                        <td className="px-5 py-3 font-semibold text-white/85">
                                            {r.amount.toLocaleString("en-US", {
                                                style: "currency",
                                                currency: "USD",
                                                maximumFractionDigits: 0,
                                            })}
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-md bg-white/[0.06] flex items-center justify-center text-[9px] font-bold text-white/50">
                                                    {r.sender_country?.slice(0, 2).toUpperCase()}
                                                </div>
                                                <span className="text-white/55">{r.sender_country}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-md bg-white/[0.06] flex items-center justify-center text-[9px] font-bold text-white/50">
                                                    {r.receiver_country?.slice(0, 2).toUpperCase()}
                                                </div>
                                                <span className="text-white/55">{r.receiver_country}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-right font-semibold text-white/80">
                                            {(r.risk_probability * 100).toFixed(1)}%
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${badge.cls}`}>
                                                {badge.label}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Empty state */}
            {!loading && !error && rows.length === 0 && (
                <div className="py-12 flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mb-1">
                        <svg className="w-5 h-5 text-white/20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-xs text-white/30">No suspicious transactions found</p>
                </div>
            )}
        </div>
    )
}
