"use client"

import { useEffect } from "react"

/**
 * Refracción real para el vidrio, no desenfoque.
 *
 * Un cristal no emborrona lo que hay detrás: lo desplaza. Y no lo desplaza por
 * igual — el interior es plano y deja pasar la imagen casi limpia, mientras que
 * el bisel del borde curva y concentra ahí toda la deformación. Por eso el
 * fondo se sigue viendo, que es la mitad de la gracia.
 *
 * Se genera un mapa de desplazamiento por elemento: el canal rojo lleva el
 * corrimiento en X y el verde el de Y, con 128 como cero. Luego un filtro SVG
 * con feDisplacementMap lo aplica al backdrop.
 *
 * Solo Chromium acepta url() dentro de backdrop-filter. En el resto se queda el
 * desenfoque del CSS, que es un plan B digno.
 */

const BISEL = 26 // grosor del canto que refracta, en px
const FUERZA = 42 // desplazamiento máximo en el filo, en px

/** Distancia con signo a un rectángulo redondeado. Negativa dentro. */
function sdf(px: number, py: number, mitadX: number, mitadY: number, radio: number) {
  const qx = Math.abs(px) - (mitadX - radio)
  const qy = Math.abs(py) - (mitadY - radio)
  const ax = Math.max(qx, 0)
  const ay = Math.max(qy, 0)
  return Math.hypot(ax, ay) + Math.min(Math.max(qx, qy), 0) - radio
}

function generarMapa(ancho: number, alto: number, radio: number) {
  // A mitad de resolución: el mapa se interpola y ahorra cuatro veces el trabajo.
  const esc = 0.5
  const w = Math.max(2, Math.round(ancho * esc))
  const h = Math.max(2, Math.round(alto * esc))
  const r = radio * esc
  const bisel = BISEL * esc

  const lienzo = document.createElement("canvas")
  lienzo.width = w
  lienzo.height = h
  const ctx = lienzo.getContext("2d")
  if (!ctx) return null

  const img = ctx.createImageData(w, h)
  const d = img.data
  const mx = w / 2
  const my = h / 2

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const px = x - mx + 0.5
      const py = y - my + 0.5
      const dist = sdf(px, py, mx, my, r)
      const dentro = -dist // cuánto se adentra desde el borde

      let despX = 0
      let despY = 0

      if (dentro >= 0 && dentro < bisel) {
        // Perfil squircle: la pendiente se dispara al acercarse al filo, así que
        // la deformación crece de golpe en el borde y muere hacia el centro.
        const t = 1 - dentro / bisel
        const fuerza = t * t * t

        // Normal del contorno = gradiente del campo de distancia.
        const e = 1
        const gx = sdf(px + e, py, mx, my, r) - sdf(px - e, py, mx, my, r)
        const gy = sdf(px, py + e, mx, my, r) - sdf(px, py - e, mx, my, r)
        const largo = Math.hypot(gx, gy) || 1

        despX = (gx / largo) * fuerza
        despY = (gy / largo) * fuerza
      }

      const i = (y * w + x) * 4
      d[i] = 128 + despX * 127
      d[i + 1] = 128 + despY * 127
      d[i + 2] = 128
      d[i + 3] = 255
    }
  }

  ctx.putImageData(img, 0, 0)
  return lienzo.toDataURL()
}

export function VidrioLiquido() {
  useEffect(() => {
    if (!CSS.supports("backdrop-filter", "url(#x)")) return

    const svgNS = "http://www.w3.org/2000/svg"
    let contenedor = document.getElementById("filtros-vidrio") as SVGSVGElement | null
    if (!contenedor) {
      contenedor = document.createElementNS(svgNS, "svg") as SVGSVGElement
      contenedor.id = "filtros-vidrio"
      contenedor.setAttribute("aria-hidden", "true")
      contenedor.setAttribute("color-interpolation-filters", "sRGB")
      contenedor.classList.add("filtros")
      document.body.appendChild(contenedor)
    }

    let n = 0
    const aplicar = (el: HTMLElement) => {
      const caja = el.getBoundingClientRect()
      if (caja.width < 8 || caja.height < 8) return

      // Regenerar el mapa cuesta caro y solo hace falta si cambió el tamaño.
      const huella = `${Math.round(caja.width)}x${Math.round(caja.height)}`
      if (el.dataset.vidrioHuella === huella) return
      el.dataset.vidrioHuella = huella

      const estilo = getComputedStyle(el)
      const radio = Number.parseFloat(estilo.borderRadius) || 0
      const mapa = generarMapa(caja.width, caja.height, Math.min(radio, caja.height / 2))
      if (!mapa) return

      const id = el.dataset.filtroVidrio ?? `vidrio-${n++}`
      el.dataset.filtroVidrio = id
      contenedor!.querySelector(`#${id}`)?.remove()

      const filtro = document.createElementNS(svgNS, "filter")
      filtro.id = id
      filtro.setAttribute("x", "0")
      filtro.setAttribute("y", "0")
      filtro.setAttribute("width", "100%")
      filtro.setAttribute("height", "100%")
      filtro.setAttribute("filterUnits", "objectBoundingBox")

      const imagen = document.createElementNS(svgNS, "feImage")
      imagen.setAttribute("href", mapa)
      imagen.setAttribute("preserveAspectRatio", "none")
      imagen.setAttribute("x", "0")
      imagen.setAttribute("y", "0")
      imagen.setAttribute("width", `${caja.width}`)
      imagen.setAttribute("height", `${caja.height}`)
      imagen.setAttribute("result", "mapa")

      const desplazar = document.createElementNS(svgNS, "feDisplacementMap")
      desplazar.setAttribute("in", "SourceGraphic")
      desplazar.setAttribute("in2", "mapa")
      desplazar.setAttribute("scale", `${FUERZA}`)
      desplazar.setAttribute("xChannelSelector", "R")
      desplazar.setAttribute("yChannelSelector", "G")

      filtro.append(imagen, desplazar)
      contenedor!.appendChild(filtro)

      const desenfoque = el.dataset.vidrioBlur ?? "8px"
      el.style.backdropFilter = `blur(${desenfoque}) saturate(180%) url(#${id})`
    }

    /**
     * Ojo: aplicar() inserta los filtros en un <svg> que cuelga del body, así
     * que si el observador vigila el body mientras tanto se dispara a sí mismo
     * en bucle infinito y congela la pestaña. Se desconecta durante el trabajo
     * y se vuelve a conectar al terminar.
     */
    const observador = new MutationObserver(() => programar())

    const todos = () => {
      observador.disconnect()
      document.querySelectorAll<HTMLElement>(".glass").forEach((el) => aplicar(el))
      // `open` incluido: abrir un <dialog> no añade nodos, solo cambia ese
      // atributo — y hasta ese momento el panel mide cero y no se puede medir.
      observador.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["open"],
      })
    }

    let t: number
    const programar = () => {
      window.clearTimeout(t)
      t = window.setTimeout(todos, 120)
    }

    todos()
    window.addEventListener("resize", programar)

    return () => {
      observador.disconnect()
      window.removeEventListener("resize", programar)
      window.clearTimeout(t)
    }
  }, [])

  return null
}
