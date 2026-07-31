"use client"

import { useEffect } from "react"

/**
 * Reflejo especular sobre el vidrio.
 *
 * En lugar de reemplazar el cursor —que rompe la señal nativa de qué es
 * clicable y no existe en táctil—, hacemos que el material responda a la mano:
 * la luz se mueve sobre la superficie como sobre un cristal real.
 *
 * Solo se activa con puntero fino (ratón o lápiz) y respeta reduced motion.
 */
export function GlassSpecular() {
  useEffect(() => {
    const fino = window.matchMedia("(pointer: fine)").matches
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!fino || quieto) return

    let activo: HTMLElement | null = null

    const mover = (e: PointerEvent) => {
      // Los botones de "Leer el caso" también responden: son capa de control.
      const objetivo = (e.target as Element | null)?.closest<HTMLElement>(".glass, .read") ?? null

      if (objetivo !== activo) {
        activo?.style.setProperty("--spec", "0")
        activo = objetivo
        activo?.style.setProperty("--spec", "1")
      }
      if (!activo) return

      const r = activo.getBoundingClientRect()
      const x = e.clientX - r.left
      activo.style.setProperty("--mx", `${x}px`)
      activo.style.setProperty("--my", `${e.clientY - r.top}px`)
      // Posición de la veta interior, en porcentaje del ancho.
      activo.style.setProperty("--sx", `${((x / r.width) * 100).toFixed(1)}%`)
    }

    const salir = () => {
      activo?.style.setProperty("--spec", "0")
      activo = null
    }

    document.addEventListener("pointermove", mover, { passive: true })
    document.addEventListener("pointerleave", salir)
    return () => {
      document.removeEventListener("pointermove", mover)
      document.removeEventListener("pointerleave", salir)
    }
  }, [])

  return null
}
