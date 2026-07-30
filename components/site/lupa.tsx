"use client"

import { useEffect } from "react"

/**
 * Una burbuja de vidrio que recorre las capturas.
 *
 * Al pasar el cursor por dentro de una captura aparece una gota que lentea lo
 * que hay debajo. Amplía —lo justo para que se lea el detalle— pero lo que la
 * hace valer es cómo se comporta: persigue al cursor con muelle, se estira en
 * la dirección del viaje y refracta en el canto como un cristal grueso.
 *
 * Aparece SOLO mientras el puntero está dentro de la imagen.
 *
 * Solo con puntero fino: en táctil no hay hover y un dedo taparía la burbuja.
 */

const DIAMETRO = 200
const ZOOM = 1.85

// Muelle de persecución: rápido y casi sin rebote, como el interactiveSpring
// de SwiftUI. La sensación líquida sale del estiramiento, no de la oscilación.
const RESPUESTA = 0.13
const AMORTIGUACION = 0.82
const ESTIRA = 0.0022 // por px/s de velocidad

function paso(pos: number, vel: number, destino: number, dt: number) {
  const w = (2 * Math.PI) / RESPUESTA
  const a = -w * w * (pos - destino) - 2 * AMORTIGUACION * w * vel
  const v = vel + a * dt
  return { pos: pos + v * dt, vel: v }
}

/**
 * Mapa de desplazamiento circular: el interior queda neutro —la imagen pasa
 * casi limpia— y el bisel del borde curva y concentra ahí toda la refracción,
 * que es como se comporta un cristal de verdad.
 */
function mapaLente(diametro: number) {
  const d = Math.round(diametro / 2) // media resolución: se interpola
  const bisel = d * 0.3
  const lienzo = document.createElement("canvas")
  lienzo.width = d
  lienzo.height = d
  const ctx = lienzo.getContext("2d")
  if (!ctx) return null

  const img = ctx.createImageData(d, d)
  const px = img.data
  const c = d / 2

  for (let y = 0; y < d; y++) {
    for (let x = 0; x < d; x++) {
      const dx = x - c + 0.5
      const dy = y - c + 0.5
      const dist = Math.hypot(dx, dy)
      const dentro = c - dist // cuánto se adentra desde el borde

      let despX = 0
      let despY = 0
      if (dentro >= 0 && dentro < bisel) {
        // Perfil squircle: la pendiente se dispara al acercarse al filo.
        const t = 1 - dentro / bisel
        const fuerza = t * t * t
        const largo = dist || 1
        despX = (dx / largo) * fuerza
        despY = (dy / largo) * fuerza
      }

      const i = (y * d + x) * 4
      px[i] = 128 + despX * 127
      px[i + 1] = 128 + despY * 127
      px[i + 2] = 128
      px[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  return lienzo.toDataURL()
}

export function Lupa() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return
    const suave = !window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // La burbuja: el canto va fuera y la imagen refractada dentro, para que el
    // filtro deforme el contenido sin comerse el brillo del borde.
    const lente = document.createElement("div")
    lente.className = "lupa"
    lente.setAttribute("aria-hidden", "true")
    lente.style.width = `${DIAMETRO}px`
    lente.style.height = `${DIAMETRO}px`

    const cristal = document.createElement("div")
    cristal.className = "lupaimg"
    lente.appendChild(cristal)

    // Filtro de refracción, uno solo para toda la página.
    const svgNS = "http://www.w3.org/2000/svg"
    const mapa = mapaLente(DIAMETRO)
    if (mapa && CSS.supports("filter", "url(#x)")) {
      const svg = document.createElementNS(svgNS, "svg")
      svg.setAttribute("class", "filtros")
      svg.setAttribute("aria-hidden", "true")
      svg.setAttribute("color-interpolation-filters", "sRGB")
      const filtro = document.createElementNS(svgNS, "filter")
      filtro.id = "lente-refraccion"
      filtro.setAttribute("x", "0")
      filtro.setAttribute("y", "0")
      filtro.setAttribute("width", "100%")
      filtro.setAttribute("height", "100%")
      const imagen = document.createElementNS(svgNS, "feImage")
      imagen.setAttribute("href", mapa)
      imagen.setAttribute("preserveAspectRatio", "none")
      imagen.setAttribute("width", `${DIAMETRO}`)
      imagen.setAttribute("height", `${DIAMETRO}`)
      imagen.setAttribute("result", "mapa")
      const desplazar = document.createElementNS(svgNS, "feDisplacementMap")
      desplazar.setAttribute("in", "SourceGraphic")
      desplazar.setAttribute("in2", "mapa")
      desplazar.setAttribute("scale", "34")
      desplazar.setAttribute("xChannelSelector", "R")
      desplazar.setAttribute("yChannelSelector", "G")
      filtro.append(imagen, desplazar)
      svg.appendChild(filtro)
      document.body.appendChild(svg)
      cristal.style.filter = "url(#lente-refraccion)"
    }

    let activa: HTMLElement | null = null
    let destX = 0
    let destY = 0
    let posX = 0
    let posY = 0
    let velX = 0
    let velY = 0
    let arrancada = false
    let anterior = 0
    let vivo = true

    const pintar = () => {
      if (!activa) return
      const r = activa.getBoundingClientRect()
      // La imagen ampliada se ancla a la posición REAL del cursor, no a la de
      // la burbuja: así el vidrio se desliza sobre la imagen en lugar de
      // arrastrarla, que es lo que delata el truco.
      const x = destX - r.left
      const y = destY - r.top
      cristal.style.backgroundSize = `${r.width * ZOOM}px ${r.height * ZOOM}px`
      cristal.style.backgroundPosition = `${-(x * ZOOM - DIAMETRO / 2)}px ${-(y * ZOOM - DIAMETRO / 2)}px`
    }

    /**
     * Coloca la burbuja. Estirada en la dirección del viaje y adelgazada en la
     * perpendicular: el volumen se conserva y por eso se lee como gota y no
     * como círculo que se desliza.
     */
    const situar = () => {
      const rapidez = Math.hypot(velX, velY)
      const tension = Math.min(rapidez * ESTIRA, 0.3)
      const angulo = rapidez > 1 ? (Math.atan2(velY, velX) * 180) / Math.PI : 0

      lente.style.transform =
        `translate(${posX - DIAMETRO / 2}px, ${posY - DIAMETRO / 2}px)` +
        ` rotate(${angulo}deg) scale(${1 + tension}, ${1 - tension * 0.62}) rotate(${-angulo}deg)`
    }

    const marco = (ahora: number) => {
      if (!vivo) return
      requestAnimationFrame(marco)
      if (!activa) return

      const dt = anterior ? Math.min((ahora - anterior) / 1000, 1 / 30) : 1 / 60
      anterior = ahora

      if (suave) {
        ;({ pos: posX, vel: velX } = paso(posX, velX, destX, dt))
        ;({ pos: posY, vel: velY } = paso(posY, velY, destY, dt))
      } else {
        posX = destX
        posY = destY
      }

      situar()
      pintar()
    }

    const abrir = (e: PointerEvent) => {
      const zona = (e.target as Element | null)?.closest?.<HTMLElement>(".shotimg")
      if (!zona) return
      const fuente = zona.closest<HTMLElement>(".shot")?.dataset.full
      if (!fuente) return

      activa = zona
      destX = e.clientX
      destY = e.clientY
      if (!arrancada) {
        posX = destX
        posY = destY
        velX = 0
        velY = 0
        arrancada = true
      }
      cristal.style.backgroundImage = `url("${fuente}")`

      /**
       * Un <dialog> abierto con showModal() se pinta en la top layer del
       * navegador, por encima de cualquier z-index. Colgada del body, la
       * burbuja quedaría escondida detrás del modal — justo donde están casi
       * todas las capturas.
       */
      const anfitrion = zona.closest("dialog[open]") ?? document.body
      if (lente.parentElement !== anfitrion) anfitrion.appendChild(lente)

      // Colocarla ANTES de mostrarla: el transform solo se actualiza en el
      // bucle de animación, así que sin esto la burbuja asomaría un frame en la
      // esquina superior izquierda antes de saltar al cursor.
      situar()
      pintar()
      // Reflujo forzado en vez de requestAnimationFrame: no depende de que se
      // pinte un frame, así la entrada nunca se queda a medias.
      void lente.offsetWidth
      lente.classList.add("viva")
    }

    const cerrar = () => {
      activa = null
      arrancada = false
      lente.classList.remove("viva")
    }

    const alMover = (e: PointerEvent) => {
      const dentro = (e.target as Element | null)?.closest?.<HTMLElement>(".shotimg")
      if (!dentro) {
        if (activa) cerrar()
        return
      }
      if (dentro !== activa) {
        abrir(e)
        return
      }
      // Fuera del área aunque el target siga siendo la imagen (salidas rápidas).
      const r = dentro.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      if (x < 0 || y < 0 || x > r.width || y > r.height) {
        cerrar()
        return
      }
      destX = e.clientX
      destY = e.clientY
    }

    const id = requestAnimationFrame(marco)
    document.addEventListener("pointerover", abrir)
    document.addEventListener("pointermove", alMover, { passive: true })
    document.addEventListener("pointerleave", cerrar)
    /**
     * En fase de captura: dentro del modal el scroll ocurre en .modalcuerpo y
     * ese evento no burbujea hasta window.
     */
    document.addEventListener("scroll", cerrar, { capture: true, passive: true })

    return () => {
      vivo = false
      cancelAnimationFrame(id)
      document.removeEventListener("pointerover", abrir)
      document.removeEventListener("pointermove", alMover)
      document.removeEventListener("pointerleave", cerrar)
      document.removeEventListener("scroll", cerrar, { capture: true })
      lente.remove()
      document.getElementById("lente-refraccion")?.closest("svg")?.remove()
    }
  }, [])

  return null
}
