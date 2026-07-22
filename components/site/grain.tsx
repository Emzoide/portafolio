"use client"

import { useEffect, useRef } from "react"

/**
 * Grano de película sobre la atmósfera.
 *
 * Es lo que más separa "caro" de "autogenerado": rompe el degradado limpio
 * y le da materia a la superficie. Se pinta una sola vez y se repinta al
 * cambiar de tamaño.
 */
export function Grain() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const host = canvas?.parentElement
    if (!canvas || !host) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const pintar = () => {
      const w = Math.max(1, host.offsetWidth)
      const h = Math.max(1, host.offsetHeight)
      canvas.width = w
      canvas.height = h
      const img = ctx.createImageData(w, h)
      const d = img.data
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0
        d[i] = v
        d[i + 1] = v
        d[i + 2] = v
        d[i + 3] = 255
      }
      ctx.putImageData(img, 0, 0)
    }

    pintar()
    const ro = new ResizeObserver(() => pintar())
    ro.observe(host)
    return () => ro.disconnect()
  }, [])

  return <canvas ref={ref} className="grain" aria-hidden="true" />
}
