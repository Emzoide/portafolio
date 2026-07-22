import type React from "react"
import type { Metadata } from "next"
import { Instrument_Serif, Instrument_Sans, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ACTIVE_PALETTE } from "@/lib/theme"
import { perfil, titular } from "@/lib/content"
import "./globals.css"

const display = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

const body = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
})

const data = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-data",
  display: "swap",
})

export const metadata: Metadata = {
  title: `${perfil.nombre} — ${perfil.rol}`,
  description: titular.bajada,
  openGraph: {
    title: `${perfil.nombre} — ${perfil.rol}`,
    description: titular.bajada,
    locale: "es_PE",
    type: "website",
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" data-palette={ACTIVE_PALETTE}>
      <body className={`${display.variable} ${body.variable} ${data.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
