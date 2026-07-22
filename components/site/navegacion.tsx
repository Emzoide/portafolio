"use client"

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"

/**
 * La barra, con una gota que persigue al puntero.
 *
 * La clave: la gota NO sigue a la sección activa, sigue a tu mano. Como en
 * iOS, donde mantienes el dedo en un menú y la gota va detrás. Al soltar el
 * ratón vuelve sola a la sección en la que estás.
 *
 * Se lee como líquido por tres cosas a la vez:
 *  - muelle con rebote en lugar de transición lineal;
 *  - se estira en la dirección del viaje y adelgaza en la perpendicular,
 *    conservando el volumen;
 *  - deja un rastro: una segunda gota más lenta y tenue que la persigue y solo
 *    se separa cuando hay velocidad de verdad.
 *
 * (La técnica gooey clásica —desenfocar y endurecer el alfa con feColorMatrix—
 * exige fondo opaco, así que sobre vidrio transparente no sirve.)
 */

const SECCIONES = [
  { id: "trabajo", texto: "Trabajo" },
  { id: "sobre-mi", texto: "Sobre mí" },
  { id: "contacto", texto: "Contacto" },
]

const MUELLE = 0.19
const ROCE = 0.7
const ESTIRA = 0.024
const MUELLE_RASTRO = 0.1 // más flojo: por eso se queda atrás

export function Navegacion({ correo, nombre }: { correo: string; nombre: string }) {
  const barra = useRef<HTMLDivElement>(null)
  const gota = useRef<HTMLSpanElement>(null)
  const rastro = useRef<HTMLSpanElement>(null)
  const enlaces = useRef<(HTMLAnchorElement | null)[]>([])
  const objetivo = useRef(0) // a quién persigue ahora mismo
  const pulso = useRef(1) // 1 en reposo; baja al pulsar

  const [activa, setActiva] = useState(0)
  const [vertical, setVertical] = useState(false)

  // Qué sección manda según el scroll.
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
      { threshold: [0, 0.2, 0.5, 0.8], rootMargin: "-15% 0px -35% 0px" },
    )
    SECCIONES.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  // Sin hover, la gota vuelve a la sección activa.
  useEffect(() => {
    objetivo.current = activa
  }, [activa])

  /**
   * Pasado el hero la barra se va al lateral. Por posición de scroll y no por
   * IntersectionObserver: si el observador no disparara, se quedaría clavada
   * en vertical encima de la portada. La histéresis evita el parpadeo.
   */
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".atmos")
    if (!hero) return
    const mirar = () => {
      const limite = hero.offsetHeight - 90
      setVertical((antes) => (antes ? window.scrollY > limite - 130 : window.scrollY > limite))
    }
    mirar()
    window.addEventListener("scroll", mirar, { passive: true })
    window.addEventListener("resize", mirar)
    return () => {
      window.removeEventListener("scroll", mirar)
      window.removeEventListener("resize", mirar)
    }
  }, [])

  /**
   * El vuelo de arriba al costado (técnica FLIP): se mide dónde estaba la barra
   * antes del cambio de disposición y se la anima desde ahí hasta su sitio
   * nuevo. Sin esto desaparece de un sitio y aparece en otro, que es justo lo
   * que rompe la ilusión.
   *
   * Solo se traslada, nunca se escala: escalar aplastaría el texto.
   */
  const cajaPrevia = useRef<DOMRect | null>(null)
  useLayoutEffect(() => {
    const nav = barra.current
    if (!nav) return
    const ahora = nav.getBoundingClientRect()
    const antes = cajaPrevia.current
    cajaPrevia.current = ahora
    if (!antes || matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const dx = antes.left + antes.width / 2 - (ahora.left + ahora.width / 2)
    const dy = antes.top + antes.height / 2 - (ahora.top + ahora.height / 2)
    if (Math.abs(dx) < 2 && Math.abs(dy) < 2) return

    nav.animate(
      [
        { transform: `translate(${dx}px, ${dy}px)`, opacity: 0.55 },
        { transform: "translate(0, 0)", opacity: 1 },
      ],
      { duration: 640, easing: "cubic-bezier(0.32, 1.14, 0.36, 1)" },
    )
  }, [vertical])

  // El muelle. Un bucle vivo mientras la barra exista.
  useEffect(() => {
    const suave = !matchMedia("(prefers-reduced-motion: reduce)").matches

    let pos = 0
    let vel = 0
    let posR = 0 // el rastro
    let arrancado = false
    let vivo = true

    const colocar = () => {
      const el = enlaces.current[objetivo.current]
      const g = gota.current
      const r = rastro.current
      if (!el || !g) return

      const destino = vertical ? el.offsetTop : el.offsetLeft
      if (!arrancado) {
        pos = destino
        posR = destino
        arrancado = true
      }

      if (suave) {
        vel += (destino - pos) * MUELLE
        vel *= ROCE
        pos += vel
        posR += (pos - posR) * MUELLE_RASTRO
      } else {
        pos = destino
        posR = destino
        vel = 0
      }

      // Estirada en la dirección del viaje, adelgazada en la perpendicular:
      // el volumen se conserva y por eso parece una gota y no un rectángulo.
      const tension = Math.min(Math.abs(vel) * ESTIRA, 0.5)
      const largo = (1 + tension) * pulso.current
      const ancho = (1 - tension * 0.55) * pulso.current

      const w = el.offsetWidth
      const h = el.offsetHeight
      g.style.width = `${w}px`
      g.style.height = `${h}px`
      g.style.transform = vertical
        ? `translateY(${pos}px) scale(${ancho}, ${largo})`
        : `translateX(${pos}px) scale(${largo}, ${ancho})`

      if (r) {
        const desfase = Math.min(Math.abs(pos - posR) / 60, 1)
        r.style.width = `${w}px`
        r.style.height = `${h}px`
        r.style.opacity = `${desfase * 0.5}`
        r.style.transform = vertical
          ? `translateY(${posR}px) scale(${ancho}, ${largo})`
          : `translateX(${posR}px) scale(${largo}, ${ancho})`
      }

      // El pulso del clic vuelve solo a su sitio.
      pulso.current += (1 - pulso.current) * 0.18
    }

    colocar() // sin esperar al primer fotograma, por si la pestaña está oculta

    const marco = () => {
      if (!vivo) return
      colocar()
      requestAnimationFrame(marco)
    }
    const id = requestAnimationFrame(marco)

    return () => {
      vivo = false
      cancelAnimationFrame(id)
    }
  }, [vertical])

  const perseguir = useCallback((i: number) => {
    objetivo.current = i
  }, [])
  const soltar = useCallback(() => {
    objetivo.current = activa
  }, [activa])

  // Al pulsar: la gota se encoge de golpe y el muelle la devuelve, hinchada.
  const ir = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string, i: number) => {
    e.preventDefault()
    pulso.current = 0.72
    objetivo.current = i
    setActiva(i)
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [])

  return (
    <div className="navwrap" data-modo={vertical ? "vertical" : "horizontal"}>
      <div className="nav glass" ref={barra}>
        <span className="mark">
          {nombre}
          <i>.</i>
        </span>

        <nav onPointerLeave={soltar}>
          <span className="gota rastro" ref={rastro} aria-hidden="true" />
          <span className="gota" ref={gota} aria-hidden="true" />
          {SECCIONES.map((s, i) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              ref={(el) => {
                enlaces.current[i] = el
              }}
              aria-current={activa === i ? "true" : undefined}
              onPointerEnter={() => perseguir(i)}
              onFocus={() => perseguir(i)}
              onBlur={soltar}
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
