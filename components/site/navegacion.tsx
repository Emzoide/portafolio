"use client"

import { useCallback, useEffect, useRef, useState } from "react"

/**
 * La barra, con una gota que persigue la sección activa.
 *
 * Lo que hace que se lea como líquido no es fundirse con nada: es estirarse.
 * La cápsula se alarga en la dirección en que viaja, en proporción a su
 * velocidad, y se recompone al llegar. Eso, más un muelle con rebote en vez de
 * una transición lineal, es toda la ilusión.
 *
 * (La técnica gooey clásica —desenfocar y endurecer el alfa con feColorMatrix—
 * exige fondo opaco, así que sobre vidrio transparente no se puede usar.)
 *
 * Pasado el hero la barra deja de estar arriba y se convierte en un raíl
 * vertical pegado a la izquierda: la misma guía, girada.
 */

const SECCIONES = [
  { id: "trabajo", texto: "Trabajo" },
  { id: "sobre-mi", texto: "Sobre mí" },
  { id: "contacto", texto: "Contacto" },
]

const MUELLE = 0.16 // tirón hacia el destino
const ROCE = 0.72 // cuánto se frena: más bajo, más rebote
const ESTIRA = 0.02 // cuánto alarga por unidad de velocidad

export function Navegacion({ correo, nombre }: { correo: string; nombre: string }) {
  const barra = useRef<HTMLDivElement>(null)
  const gota = useRef<HTMLSpanElement>(null)
  const enlaces = useRef<(HTMLAnchorElement | null)[]>([])
  const [activa, setActiva] = useState(0)
  const [vertical, setVertical] = useState(false)

  // Scrollspy: qué sección manda ahora mismo.
  useEffect(() => {
    const vistos = new Map<string, number>()
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) vistos.set(e.target.id, e.intersectionRatio)
        let mejor = 0
        let ratio = 0
        SECCIONES.forEach((s, i) => {
          const r = vistos.get(s.id) ?? 0
          if (r > ratio) {
            ratio = r
            mejor = i
          }
        })
        if (ratio > 0) setActiva(mejor)
      },
      { threshold: [0, 0.15, 0.35, 0.6, 0.9], rootMargin: "-15% 0px -35% 0px" },
    )
    SECCIONES.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  /**
   * Pasado el hero, la barra se va al lateral.
   *
   * Por posición de scroll y no por IntersectionObserver a propósito: si el
   * observador no dispara, la barra se quedaría clavada en vertical encima de
   * la portada. Comparar dos números no falla nunca, y hay histéresis para que
   * no parpadee justo en el umbral.
   */
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".atmos")
    if (!hero) return

    const mirar = () => {
      const limite = hero.offsetHeight - 90
      setVertical((antes) => {
        const y = window.scrollY
        if (antes) return y > limite - 120
        return y > limite
      })
    }

    mirar()
    window.addEventListener("scroll", mirar, { passive: true })
    window.addEventListener("resize", mirar)
    return () => {
      window.removeEventListener("scroll", mirar)
      window.removeEventListener("resize", mirar)
    }
  }, [])

  // El muelle. Persigue al enlace activo y se deforma con su propia velocidad.
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const el = enlaces.current[activa]
      const g = gota.current
      if (el && g) {
        g.style.transform = vertical
          ? `translateY(${el.offsetTop}px)`
          : `translateX(${el.offsetLeft}px)`
        g.style.width = `${el.offsetWidth}px`
        g.style.height = `${el.offsetHeight}px`
      }
      return
    }

    let pos = 0
    let vel = 0
    let corriendo = true
    let arrancado = false

    /**
     * Colocación inmediata, sin esperar al primer fotograma. Si la pestaña
     * está en segundo plano requestAnimationFrame no dispara, y sin esto la
     * gota nacería sin tamaño ni posición y no se vería nada.
     */
    const inicial = enlaces.current[activa]
    if (inicial && gota.current) {
      pos = vertical ? inicial.offsetTop : inicial.offsetLeft
      arrancado = true
      gota.current.style.width = `${inicial.offsetWidth}px`
      gota.current.style.height = `${inicial.offsetHeight}px`
      gota.current.style.transform = vertical
        ? `translateY(${pos}px)`
        : `translateX(${pos}px)`
    }

    const marco = () => {
      if (!corriendo) return
      const el = enlaces.current[activa]
      const g = gota.current
      if (!el || !g) {
        requestAnimationFrame(marco)
        return
      }

      const destino = vertical ? el.offsetTop : el.offsetLeft
      if (!arrancado) {
        pos = destino
        arrancado = true
      }

      vel += (destino - pos) * MUELLE
      vel *= ROCE
      pos += vel

      // Estirada en la dirección del viaje, encogida en la perpendicular:
      // el volumen se conserva, que es lo que lo hace parecer una gota.
      const tension = Math.min(Math.abs(vel) * ESTIRA, 0.42)
      const largo = 1 + tension
      const ancho = 1 - tension * 0.55

      g.style.width = `${el.offsetWidth}px`
      g.style.height = `${el.offsetHeight}px`
      g.style.transform = vertical
        ? `translateY(${pos}px) scale(${ancho}, ${largo})`
        : `translateX(${pos}px) scale(${largo}, ${ancho})`

      requestAnimationFrame(marco)
    }

    const id = requestAnimationFrame(marco)
    return () => {
      corriendo = false
      cancelAnimationFrame(id)
    }
  }, [activa, vertical])

  // Al pulsar: la gota se encoge, rebota y lleva a la sección.
  const ir = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string, i: number) => {
    e.preventDefault()
    setActiva(i)
    const g = gota.current
    if (g && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      g.animate(
        [{ filter: "brightness(1.5)" }, { filter: "brightness(1)" }],
        { duration: 420, easing: "ease-out" },
      )
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [])

  return (
    <div className="navwrap" data-modo={vertical ? "vertical" : "horizontal"}>
      <div className="nav glass" ref={barra}>
        <span className="mark">
          {nombre}
          <i>.</i>
        </span>

        <nav>
          <span className="gota" ref={gota} aria-hidden="true" />
          {SECCIONES.map((s, i) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              ref={(el) => {
                enlaces.current[i] = el
              }}
              aria-current={activa === i ? "true" : undefined}
              onClick={(e) => ir(e, s.id, i)}
            >
              {s.texto}
            </a>
          ))}
        </nav>

        <a className="cta" href={`mailto:${correo}`}>
          Conversemos
        </a>
      </div>
    </div>
  )
}
