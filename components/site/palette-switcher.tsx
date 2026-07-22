"use client"

import { useEffect, useState } from "react"
import { PALETTES, ACTIVE_PALETTE, type PaletteId } from "@/lib/theme"

/**
 * Selector de paleta para probar colores en vivo. Solo aparece en
 * desarrollo — en producción manda ACTIVE_PALETTE de lib/theme.ts.
 *
 * La elección se guarda en localStorage para que sobreviva a los recargados
 * mientras estás decidiendo.
 */
export function PaletteSwitcher() {
  const [activa, setActiva] = useState<PaletteId>(ACTIVE_PALETTE)

  useEffect(() => {
    const guardada = window.localStorage.getItem("paleta") as PaletteId | null
    if (guardada && PALETTES.some((p) => p.id === guardada)) aplicar(guardada)
  }, [])

  const aplicar = (id: PaletteId) => {
    document.documentElement.dataset.palette = id
    window.localStorage.setItem("paleta", id)
    setActiva(id)
  }

  if (process.env.NODE_ENV === "production") return null

  return (
    <div className="swatcher glass" role="group" aria-label="Probar paleta">
      {PALETTES.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => aplicar(p.id)}
          aria-pressed={activa === p.id}
          aria-label={`${p.nombre}. ${p.nota}`}
          title={`${p.nombre} — ${p.nota}`}
          data-palette={p.id}
          style={{ background: "var(--accent)" }}
        />
      ))}
    </div>
  )
}
