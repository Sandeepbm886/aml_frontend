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
        <ClerkProvider signInForceRedirectUrl="/transaction" signUpForceRedirectUrl="/transaction">

          {/* ── Top auth bar ──────────────────────────────── */}
          <header className="fixed top-0 right-0 z-50 flex items-center gap-3 px-5 py-3">
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
