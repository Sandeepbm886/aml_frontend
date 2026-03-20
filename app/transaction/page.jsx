"use client"
import { useState } from "react"
import RiskDashboard from "../_components/RiskDashboard"
import TransactionForm from "../_components/TransactionForm"
import SuspiciousTransactions from "../_components/SuspiciousTable"

export default function Page() {
    const [refreshKey, setRefreshKey] = useState(0)

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#0a0d14]">

            {/* Subtle grid background */}
            <div
                className="pointer-events-none fixed inset-0 z-0"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />

            {/* Ambient glow */}
            <div className="pointer-events-none fixed top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px] z-0" />
            <div className="pointer-events-none fixed bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/8 blur-[100px] z-0" />

            {/* ── LEFT: form ─────────────────────────────────── */}
            <aside className="relative z-10 w-[440px] shrink-0 overflow-y-auto border-r border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
                {/* Top branding bar */}
                <div className="px-6 pt-6 pb-4 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-[13px] font-bold text-white tracking-tight leading-none">SentinelAI</p>
                            <p className="text-[10px] text-white/40 mt-0.5">Fraud Detection Platform</p>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-6">
                    <TransactionForm onSuccess={() => setRefreshKey(k => k + 1)} />
                </div>
            </aside>

            {/* ── RIGHT: stacked ─────────────────────────────── */}
            <div className="relative z-10 flex-1 min-w-0 flex flex-col overflow-hidden">

                {/* Top nav bar */}
                <header className="shrink-0 h-14 flex items-center justify-between px-6 border-b border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <h1 className="text-sm font-semibold text-white/90">Risk Intelligence Center</h1>
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/20 text-[10px] font-medium text-indigo-300">
                            Live
                        </span>
                    </div>
                    
                </header>

                <div className="flex-1 overflow-hidden flex flex-col gap-4 px-6 py-5">
                    {/* charts */}
                    <div className="shrink-0 max-h-[52%] overflow-y-auto">
                        <RiskDashboard refreshKey={refreshKey} />
                    </div>

                    {/* table */}
                    <div className="flex-1 min-h-[260px] overflow-y-auto pb-2">
                        <SuspiciousTransactions refreshKey={refreshKey} />
                    </div>
                </div>

            </div>
        </div>
    )
}
