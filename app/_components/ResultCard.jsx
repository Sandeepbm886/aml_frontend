import React from 'react'

const ResultCard = ({RISK_CONFIG,result}) => {
  const cfg = RISK_CONFIG[result.risk_level] ?? RISK_CONFIG.Low
    const pct = Math.round((result.risk_probability ?? 0) * 100)

    return (
        <div
            className={`mt-5 rounded-xl border ${cfg.border} ${cfg.bg} p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300`}
        >
            {/* Header row */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${cfg.iconBg}`}>
                        {cfg.icon}
                    </span>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Analysis Result</p>
                        <p className="text-sm font-semibold text-gray-800">{cfg.label}</p>
                    </div>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.badge}`}>
                    {result.risk_level}
                </span>
            </div>

            {/* Risk probability bar */}
            <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-gray-500">
                    <span>Risk Probability</span>
                    <span className="font-semibold text-gray-700">{pct}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${cfg.bar}`}
                        style={{ width: `${pct}%` }}
                    />
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-white/70 border border-gray-100 px-3 py-2">
                    <p className="text-xs text-gray-400 uppercase tracking-widest">Laundering Risk</p>
                    <p className="text-lg font-bold text-gray-800 mt-0.5">
                        {result.laundering_risk ?? 0}
                    </p>
                </div>
                <div className="rounded-lg bg-white/70 border border-gray-100 px-3 py-2">
                    <p className="text-xs text-gray-400 uppercase tracking-widest">Risk Score</p>
                    <p className="text-lg font-bold text-gray-800 mt-0.5">{pct}%</p>
                </div>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-500 leading-relaxed">{cfg.description}</p>
        </div>
    )
}

export default ResultCard