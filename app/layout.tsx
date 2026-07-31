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

/**
 * De dónde cuelgan las imágenes sociales.
 *
 * Tienen que ser URLs absolutas o WhatsApp y LinkedIn no las cargan, así que
 * sin esto la tarjeta de compartir saldría apuntando a localhost.
 *
 * NEXT_PUBLIC_SITIO manda cuando hay dominio propio; si no, se usa el que
 * Vercel inyecta en cada despliegue, y en local el puerto de desarrollo.
 */
function sitio() {
  if (process.env.NEXT_PUBLIC_SITIO) return process.env.NEXT_PUBLIC_SITIO
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return "http://localhost:3100"
}

export const metadata: Metadata = {
  metadataBase: new URL(sitio()),
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
