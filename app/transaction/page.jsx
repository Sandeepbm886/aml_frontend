"use client"
import { useState } from "react"
import RiskDashboard from "../_components/RiskDashboard"
import TransactionForm from "../_components/TransactionForm"
import SuspiciousTransactions from "../_components/SuspiciousTable"
import { useUser } from "@clerk/nextjs"
import * as z from "zod"

const emailSchema = z.object({
    email: z.string().email("Please enter a valid email address."),
})

const IDLE    = "idle"
const SENDING = "sending"
const SENT    = "sent"
const FAILED  = "failed"

export default function Page() {
    const [refreshKey, setRefreshKey] = useState(0)
    const { user } = useUser()

    const [dialogOpen, setDialogOpen]   = useState(false)
    const [email, setEmail]             = useState("")
    const [emailError, setEmailError]   = useState("")
    const [sendState, setSendState]     = useState(IDLE)
    const [serverError, setServerError] = useState("")

    const prefill = user?.emailAddresses?.[0]?.emailAddress ?? ""

    function openDialog() {
        setEmail(prefill)
        setEmailError("")
        setSendState(IDLE)
        setServerError("")
        setDialogOpen(true)
    }

    function closeDialog() {
        setDialogOpen(false)
    }

    function handleEmailChange(val) {
        setEmail(val)
        setServerError("")
        if (!val) { setEmailError(""); return }
        const r = emailSchema.safeParse({ email: val })
        setEmailError(r.success ? "" : (r.error.errors?.[0]?.message ?? "Invalid email"))
    }

    async function handleSend() {
        const r = emailSchema.safeParse({ email })
        if (!r.success) {
            setEmailError(r.error.errors?.[0]?.message ?? "Invalid email")
            return
        }
        setSendState(SENDING)
        setServerError("")
        try {
            const res = await fetch("/api/send-report", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error ?? "Unknown error")
            setSendState(SENT)
        } catch (err) {
            setServerError(err.message)
            setSendState(FAILED)
        }
    }

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#0a0d14]">

            {/* Grid background */}
            <div className="pointer-events-none fixed inset-0 z-0"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />
            <div className="pointer-events-none fixed top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px] z-0" />
            <div className="pointer-events-none fixed bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/8 blur-[100px] z-0" />

            {/* ── LEFT: form ─────────────────────────────────── */}
            <aside className="relative z-10 w-[440px] shrink-0 overflow-y-auto border-r border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
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

            {/* ── RIGHT ──────────────────────────────────────── */}
            <div className="relative z-10 flex-1 min-w-0 flex flex-col overflow-hidden">

                <header className="shrink-0 h-14 flex items-center justify-start gap-10 px-6 border-b border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <h1 className="text-sm font-semibold text-white/90">Risk Intelligence Center</h1>
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/20 text-[10px] font-medium text-indigo-300">
                            Live
                        </span>
                    </div>

                    {/* Send Report button */}
                    <button
                        onClick={openDialog}
                        className="flex items-center gap-1.5 h-8 px-3.5 rounded-lg border border-white/[0.09] bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 text-xs font-medium text-white/70 hover:text-white transition-all"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                        Send Report
                    </button>
                </header>

                <div className="flex-1 overflow-hidden flex flex-col gap-4 px-6 py-5">
                    <div className="shrink-0 max-h-[52%] overflow-y-auto">
                        <RiskDashboard refreshKey={refreshKey} />
                    </div>
                    <div className="flex-1 min-h-[260px] overflow-y-auto pb-2">
                        <SuspiciousTransactions refreshKey={refreshKey} />
                    </div>
                </div>
            </div>

            {/* ── Send Report Dialog ──────────────────────────── */}
            {dialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={sendState !== SENDING ? closeDialog : undefined}
                    />

                    {/* Panel */}
                    <div className="relative z-10 w-full max-w-md mx-4 rounded-2xl border border-white/[0.08] bg-[#0f1220] shadow-2xl shadow-black/60 overflow-hidden">

                        {/* Top accent line */}
                        <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

                        <div className="px-6 py-6">

                            {/* Header */}
                            <div className="flex items-start justify-between mb-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                                        <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-semibold text-white/90">Send Analytics Report</h2>
                                        <p className="text-[11px] text-white/35 mt-0.5">Delivered as HTML + PDF attachment</p>
                                    </div>
                                </div>
                                {sendState !== SENDING && (
                                    <button onClick={closeDialog} className="text-white/25 hover:text-white/60 transition-colors mt-0.5 shrink-0">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/* ── Success ── */}
                            {sendState === SENT ? (
                                <div className="flex flex-col items-center gap-3 py-5">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-semibold text-white/90">Report sent successfully!</p>
                                    <p className="text-xs text-white/35 text-center leading-relaxed">
                                        Delivered to <span className="text-white/60 font-medium">{email}</span>
                                    </p>
                                    <button
                                        onClick={closeDialog}
                                        className="mt-2 h-9 px-6 rounded-xl bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.08] text-xs font-medium text-white/60 hover:text-white transition-all"
                                    >
                                        Close
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {/* Email field */}
                                    <div className="mb-4">
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-white/35 mb-1.5">
                                            Recipient Email
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => handleEmailChange(e.target.value)}
                                            disabled={sendState === SENDING}
                                            autoFocus
                                            className={`w-full h-10 px-3 rounded-xl text-sm text-white/85 placeholder:text-white/20 bg-white/[0.06] border outline-none transition-colors focus:ring-1 focus:ring-indigo-500/50 disabled:opacity-50 ${
                                                emailError
                                                    ? "border-red-500/40 bg-red-500/[0.05] focus:ring-red-500/30"
                                                    : "border-white/[0.08] hover:border-white/[0.14] focus:border-indigo-500/40"
                                            }`}
                                        />
                                        {emailError && (
                                            <p className="mt-1.5 text-[11px] text-red-400/80">{emailError}</p>
                                        )}
                                    </div>

                                    {/* What gets sent tags */}
                                    <div className="flex gap-2 mb-5">
                                        {[
                                            { label: "HTML Report", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /> },
                                            { label: "PDF Attachment", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /> },
                                        ].map(({ label, icon }) => (
                                            <div key={label} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                                                <svg className="w-3 h-3 text-indigo-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">{icon}</svg>
                                                <span className="text-[11px] text-white/40">{label}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Server error */}
                                    {serverError && (
                                        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-400">
                                            {serverError}
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2.5">
                                        <button
                                            onClick={closeDialog}
                                            disabled={sendState === SENDING}
                                            className="flex-1 h-10 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-white/50 hover:text-white disabled:opacity-40 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSend}
                                            disabled={!!emailError || !email || sendState === SENDING}
                                            className="flex-1 h-10 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-xs font-semibold text-white shadow-lg shadow-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                        >
                                            {sendState === SENDING ? (
                                                <>
                                                    <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                    </svg>
                                                    Sending…
                                                </>
                                            ) : "Send Report"}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
