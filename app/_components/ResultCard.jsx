import React from 'react'

const ResultCard = ({ RISK_CONFIG, result }) => {
    const cfg = RISK_CONFIG[result.risk_level] ?? RISK_CONFIG.Low
    const pct = Math.round((result.risk_probability ?? 0) * 100)

    const tokens = {
        
        Low: {
            glow:       "shadow-emerald-500/15",
            border:     "border-emerald-500/20",
            headerBg:   "bg-emerald-500/[0.08]",
            iconRing:   "ring-emerald-500/30 bg-emerald-500/15 text-emerald-400",
            badge:      "bg-emerald-500/15 border-emerald-500/20 text-emerald-400",
            bar:        "bg-gradient-to-r from-emerald-500 to-teal-400",
            barTrack:   "bg-emerald-500/15",
            statBorder: "border-emerald-500/15",
            statBg:     "bg-emerald-500/[0.08]",
            pctColor:   "text-emerald-400",
            labelColor: "text-emerald-300",
        },
        Medium: {
            glow:       "shadow-orange-500/20",
            border:     "border-orange-500/25",
            headerBg:   "bg-orange-500/10",
            iconRing:   "ring-orange-500/30 bg-orange-500/15 text-orange-400",
            badge:      "bg-orange-500/15 border-orange-500/25 text-orange-400",
            bar:        "bg-gradient-to-r from-orange-500 to-amber-400",
            barTrack:   "bg-orange-500/15",
            statBorder: "border-orange-500/15",
            statBg:     "bg-orange-500/[0.08]",
            pctColor:   "text-orange-400",
            labelColor: "text-orange-300",
        },
        High: {
            glow:       "shadow-red-500/20",
            border:     "border-red-500/25",
            headerBg:   "bg-red-500/10",
            iconRing:   "ring-red-500/30 bg-red-500/15 text-red-400",
            badge:      "bg-red-500/15 border-red-500/25 text-red-400",
            bar:        "bg-gradient-to-r from-red-500 to-rose-400",
            barTrack:   "bg-red-500/15",
            statBorder: "border-red-500/15",
            statBg:     "bg-red-500/[0.08]",
            pctColor:   "text-red-400",
            labelColor: "text-red-300",
        },
    }
    tokens.Critical = tokens.High

    const t = tokens[result.risk_level] ?? tokens.Low

    return (
        <div
            className={`rounded-2xl border ${t.border} bg-white/[0.04] backdrop-blur-sm overflow-hidden shadow-xl ${t.glow} animate-in fade-in slide-in-from-top-2 duration-300`}
        >
            {/* ── Header ──────────────────────────────────────── */}
            <div className={`${t.headerBg} px-4 py-3.5 border-b ${t.border} flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl ring-1 ${t.iconRing} flex items-center justify-center text-base`}>
                        {cfg.icon}
                    </div>
                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-white/30">
                            Analysis Result
                        </p>
                        <p className={`text-sm font-semibold leading-none mt-0.5 ${t.labelColor}`}>
                            {cfg.label}
                        </p>
                    </div>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${t.badge}`}>
                    {result.risk_level}
                </span>
            </div>

            {/* ── Body ────────────────────────────────────────── */}
            <div className="px-4 py-4 space-y-4">

                {/* Risk probability bar */}
                <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">
                            Risk Probability
                        </span>
                        <span className={`text-xl font-bold leading-none ${t.pctColor}`}>
                            {pct}%
                        </span>
                    </div>
                    <div className={`h-1.5 w-full rounded-full ${t.barTrack} overflow-hidden`}>
                        <div
                            className={`h-full rounded-full transition-all duration-700 ease-out ${t.bar}`}
                            style={{ width: `${pct}%` }}
                        />
                    </div>
                    {/* Tick marks */}
                    <div className="flex justify-between">
                        {[0, 25, 50, 75, 100].map((v) => (
                            <span key={v} className="text-[8px] text-white/20">{v}</span>
                        ))}
                    </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-2.5">
                    <div className={`rounded-xl border ${t.statBorder} ${t.statBg} px-3 py-2.5`}>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-white/30">
                            Laundering Risk
                        </p>
                        <p className={`text-2xl font-bold leading-none mt-1 ${t.pctColor}`}>
                            {result.laundering_risk ?? 0}
                        </p>
                    </div>
                    <div className={`rounded-xl border ${t.statBorder} ${t.statBg} px-3 py-2.5`}>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-white/30">
                            Risk Score
                        </p>
                        <p className={`text-2xl font-bold leading-none mt-1 ${t.pctColor}`}>
                            {pct}%
                        </p>
                    </div>
                </div>

                {/* Description */}
                <p className="text-[11px] text-white/40 leading-relaxed">
                    {cfg.description}
                </p>

            </div>
        </div>
    )
}

export default ResultCard
