"use client"
import { Show } from "@clerk/nextjs"
import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { redirect } from "next/navigation"

const FEATURES = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: "Real-time Detection",
    desc: "Flag suspicious transactions the moment they occur.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Risk Scoring",
    desc: "Every transaction gets a precise ML-based risk score.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
      </svg>
    ),
    title: "Analytics Dashboard",
    desc: "Visual breakdowns of risk by country, type, and volume.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    title: "Global Coverage",
    desc: "Monitor cross-border transactions across all major corridors.",
  },
]

const STATS = [
  { value: "99.2%", label: "Detection accuracy" },
  { value: "<50ms", label: "Analysis latency" },
  { value: "10+", label: "Countries monitored" },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0d14] text-white overflow-x-hidden">

      {/* ── Background ───────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-indigo-600/10 blur-[140px] z-0" />
      <div className="pointer-events-none fixed bottom-0 right-0 w-[500px] h-[400px] rounded-full bg-violet-700/8 blur-[120px] z-0" />

      {/* ── Navbar ───────────────────────────────────────── */}
      <header className="relative z-20 flex items-center justify-between px-8 py-4 border-b border-white/[0.06] bg-[#0a0d14]/80 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <span className="text-sm font-bold text-white tracking-tight">SentinelAI</span>
        </div>
        <div className="flex items-center gap-2">
          <Show when="signed-out">
            
              <button onClick={()=>redirect("/sign-in")} className="h-8 px-4 rounded-lg text-xs font-semibold text-white/60 hover:text-white border border-white/[0.08] hover:border-white/20 bg-transparent hover:bg-white/[0.05] transition-all">
                Sign in
              </button>
            
            
              <button onClick={()=>redirect("/sign-up")} className="h-8 px-4 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/20 transition-all">
                Get started
              </button>
            
          </Show>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/25 bg-indigo-500/10 mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-[11px] font-medium text-indigo-300">AI-powered fraud prevention</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl font-bold tracking-tight leading-tight max-w-2xl mb-5"
          style={{ background: "linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.45))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Stop fraud before<br />it happens
        </h1>
        <p className="text-sm text-white/40 max-w-md leading-relaxed mb-10">
          Analyze every transaction in real time. SentinelAI scores risk instantly so your team can act before damage is done.
        </p>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <SignUpButton forceRedirectUrl="/transaction">
            <button className="h-11 px-7 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-xl shadow-indigo-500/25 transition-all">
              Start for free
            </button>
          </SignUpButton>
          <SignInButton forceRedirectUrl="/transaction">
            <button className="h-11 px-7 rounded-xl text-sm font-medium text-white/60 hover:text-white border border-white/[0.09] hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.07] transition-all">
              Sign in
            </button>
          </SignInButton>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────── */}
      <section className="relative z-10 flex justify-center px-6 pb-16">
        <div className="flex items-center gap-0 divide-x divide-white/[0.07] rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm overflow-hidden">
          {STATS.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center px-10 py-5">
              <span className="text-2xl font-bold text-white">{value}</span>
              <span className="text-[11px] text-white/35 mt-1">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section className="relative z-10 px-6 pb-24 max-w-4xl mx-auto">
        <p className="text-center text-[10px] font-bold uppercase tracking-widest text-white/25 mb-8">
          Everything you need
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {FEATURES.map(({ icon, title, desc }) => (
            <div key={title} className="flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.05] transition-colors p-5">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center text-indigo-400">
                {icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-white/90 leading-tight">{title}</p>
                <p className="text-[11px] text-white/35 mt-1 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA banner ───────────────────────────────────── */}
      <section className="relative z-10 px-6 pb-24 max-w-3xl mx-auto">
        <div className="relative rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-600/10 to-violet-600/10 backdrop-blur-sm overflow-hidden px-10 py-12 text-center">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent" />
          <h2 className="text-2xl font-bold text-white mb-3">Ready to secure your platform?</h2>
          <p className="text-sm text-white/40 mb-8 max-w-sm mx-auto">
            Get up and running in minutes. No credit card required.
          </p>
          <SignUpButton forceRedirectUrl="/transaction">
            <button className="h-11 px-8 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-xl shadow-indigo-500/30 transition-all">
              Create free account
            </button>
          </SignUpButton>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/[0.06] px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-white/40">SentinelAI</span>
        </div>
        <p className="text-[11px] text-white/20">&copy; {new Date().getFullYear()} SentinelAI. All rights reserved.</p>
      </footer>

    </div>
  )
}
