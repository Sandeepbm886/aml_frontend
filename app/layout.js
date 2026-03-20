import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Show } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SentinelAI — Fraud Detection Platform",
  description: "Real-time transaction risk analysis powered by AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="bg-[#0a0d14] min-h-screen">
        <ClerkProvider>

          {/* ── Top auth bar ──────────────────────────────── */}
          <header className="fixed top-0 right-0 z-50 flex items-center gap-3 px-5 py-3">
            <Show when="signed-out">
              <SignInButton>
                <button className="h-8 px-4 rounded-lg text-xs font-semibold text-white/60 hover:text-white/90 border border-white/[0.08] hover:border-white/[0.18] bg-white/[0.04] hover:bg-white/[0.08] transition-all">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="h-8 px-4 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/20 transition-all">
                  Sign Up
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-7 h-7 ring-1 ring-white/10 hover:ring-white/20 transition-all",
                  },
                }}
              />
            </Show>
          </header>

          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
