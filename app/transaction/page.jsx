"use client"
import { useState } from "react"
import RiskDashboard from "../_components/RiskDashboard"
import TransactionForm from "../_components/TransactionForm"
import SuspiciousTransactions from "../_components/SuspiciousTable"

export default function Page() {
    const [refreshKey, setRefreshKey] = useState(0)

    return (
        <div className="flex h-screen w-full overflow-hidden bg-(image:--image-back) bg-cover bg-center">

            {/* ── LEFT: form ─────────────────────────────────── */}
            <aside className="w-[420px] shrink-0 overflow-y-auto px-5 py-6 border-r border-white/30">
                <TransactionForm onSuccess={() => setRefreshKey(k => k + 1)} />
            </aside>

            {/* ── RIGHT: stacked ─────────────────────────────── */}
            <div className="flex-1 min-w-0 flex flex-col overflow-hidden px-5 py-6 gap-4">

                {/* charts — capped so table always gets room */}
                <div className="shrink-0 max-h-[55%] overflow-y-auto">
                    <RiskDashboard refreshKey={refreshKey} />
                </div>

                {/* table — guaranteed at least 280px, scrolls inside */}
                <div className="flex-1 min-h-[280px] overflow-y-auto pb-2">
                    <SuspiciousTransactions refreshKey={refreshKey} />
                </div>

            </div>

        </div>
    )
}