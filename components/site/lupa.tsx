"use client"

import { useEffect } from "react"

/**
 * Lupa de vidrio sobre las capturas.
 *
 * Varias capturas tienen letra pequeña —el SQL del agente, las tablas de
 * ausentismo— que a tamaño de página no se puede leer. Al pasar el cursor por
 * dentro de una captura aparece una burbuja que amplía de verdad el trozo que
 * hay debajo: no es un efecto decorativo, deja leer el detalle.
 *
 * Aparece SOLO mientras el puntero está dentro de la imagen; al salir se va.
 *
 * Usa el archivo original (no la versión servida en pantalla) para que al
 * ampliar se vea nítido en lugar de pixelado.
 *
 * Solo con puntero fino: en táctil no hay hover y un dedo taparía justo lo que
 * se quiere leer.
 */

const DIAMETRO = 190
const ZOOM = 2.4

export function Lupa() {
  useEffect(() => {
    const fino = window.matchMedia("(pointer: fine)").matches
    if (!fino) return

    const lente = document.createElement("div")
    lente.className = "lupa"
    lente.setAttribute("aria-hidden", "true")
    lente.style.width = `${DIAMETRO}px`
    lente.style.height = `${DIAMETRO}px`

    let activa: HTMLElement | null = null

    const colocar = (e: PointerEvent) => {
      if (!activa) return
      const img = activa.querySelector("img")
      if (!img) return

      const r = activa.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top

      // Fuera del área de la imagen: se cierra. (El pointerleave no siempre
      // dispara si el cursor sale rápido por una esquina.)
      if (x < 0 || y < 0 || x > r.width || y > r.height) {
        cerrar()
        return
      }

      const ancho = r.width * ZOOM
      const alto = r.height * ZOOM
      lente.style.backgroundSize = `${ancho}px ${alto}px`
      lente.style.backgroundPosition = `${-(x * ZOOM - DIAMETRO / 2)}px ${-(y * ZOOM - DIAMETRO / 2)}px`
      lente.style.transform = `translate(${e.clientX - DIAMETRO / 2}px, ${e.clientY - DIAMETRO / 2}px)`
    }

    const abrir = (e: PointerEvent) => {
      const zona = (e.target as Element | null)?.closest<HTMLElement>(".shotimg")
      if (!zona) return
      const fuente = zona.closest<HTMLElement>(".shot")?.dataset.full
      if (!fuente) return

      activa = zona
      lente.style.backgroundImage = `url("${fuente}")`
      colocar(e)

      /**
       * Un <dialog> abierto con showModal() se pinta en la top layer del
       * navegador, por encima de cualquier z-index. Si la lupa cuelga del body
       * queda escondida detrás del modal — justo donde más falta hace, porque
       * ahí están casi todas las capturas. Así que va dentro del propio dialog
       * cuando la captura está en uno.
       */
      const anfitrion = zona.closest("dialog[open]") ?? document.body
      if (lente.parentElement !== anfitrion) anfitrion.appendChild(lente)

      // Reflujo forzado en vez de requestAnimationFrame: basta para que la
      // transición de entrada arranque, y no depende de que se pinte un frame
      // (con la pestaña en segundo plano rAF no corre y la lupa no aparecería).
      void lente.offsetWidth
      lente.classList.add("viva")
    }

    const cerrar = () => {
      activa = null
      lente.classList.remove("viva")
    }

    const alMover = (e: PointerEvent) => {
      const dentro = (e.target as Element | null)?.closest<HTMLElement>(".shotimg")
      if (dentro && dentro === activa) colocar(e)
      else if (dentro) abrir(e)
      else if (activa) cerrar()
    }

    document.addEventListener("pointerover", abrir)
    document.addEventListener("pointermove", alMover, { passive: true })
    document.addEventListener("pointerleave", cerrar)
    /**
     * Con la página en movimiento la lupa apuntaría a otro sitio. En fase de
     * captura porque dentro del modal el scroll ocurre en .modalcuerpo, y ese
     * evento no burbujea hasta window.
     */
    document.addEventListener("scroll", cerrar, { capture: true, passive: true })

    return () => {
      document.removeEventListener("pointerover", abrir)
      document.removeEventListener("pointermove", alMover)
      document.removeEventListener("pointerleave", cerrar)
      document.removeEventListener("scroll", cerrar, { capture: true })
      lente.remove()
    }
  }, [])

  return null
}
