"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { abrirFicha } from "./dialogo"

/**
 * Una captura del sistema, enmarcada.
 *
 * El marco con la barra de tres puntos la encuadra como "pantalla incrustada":
 * así el rojo de la marca del cliente se lee como captura ajena y no pelea con
 * la paleta del sitio.
 *
 * `narrow` es para pantallas verticales (la vista del cliente): con dimensiones
 * de paisaje se deformaría o reservaría un hueco equivocado, así que le paso su
 * proporción real y la limito para que no domine.
 *
 * `width`/`height` fijan la proporción real cuando la captura no es del formato
 * horizontal estándar (correos, tarjetas), para que el navegador reserve el
 * alto correcto y no haya salto de layout.
 *
 * `reveal` enciende el fade-in al entrar en viewport. Solo lo usan las portadas
 * de la página: las capturas de dentro del modal ya entran con la burbuja, y
 * animarlas otra vez recargaría. Arranca visible (si no hay JS, se ve igual);
 * al montar, si está fuera de pantalla se oculta y se revela al hacer scroll.
 */
export function Captura({
  src,
  cap,
  narrow = false,
  width,
  height,
  reveal = false,
  abre,
  etiqueta,
  priority = false,
}: {
  src: string
  cap?: string
  narrow?: boolean
  width?: number
  height?: number
  reveal?: boolean
  /** Slug de la ficha que abre al pulsarla. Sin esto, la captura solo se mira. */
  abre?: string
  /** Qué anunciar al pulsarla. El pie no sirve: suele ser "Datos de demostración". */
  etiqueta?: string
  priority?: boolean
}) {
  const [w, h] = [width ?? (narrow ? 722 : 1918), height ?? (narrow ? 880 : 976)]
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(true)

  useEffect(() => {
    if (!reveal) return
    const el = ref.current
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const r = el.getBoundingClientRect()
    const yaVisible = r.top < window.innerHeight * 0.9 && r.bottom > 0
    if (yaVisible) return // en pantalla al cargar: no animar

    setShown(false) // fuera de pantalla: ocultar sin que se vea el cambio
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    )
    io.observe(el)
    // Red de seguridad: si el observer nunca dispara, revelar igual.
    const t = window.setTimeout(() => {
      setShown(true)
      io.disconnect()
    }, 1600)

    return () => {
      io.disconnect()
      window.clearTimeout(t)
    }
  }, [reveal])

  const clases = ["shot"]
  if (narrow) clases.push("narrow")
  if (reveal) clases.push("reveal")
  if (shown) clases.push("shown")
  if (abre) clases.push("abrible")

  const imagen = (
    <Image
      src={src}
      alt={cap ?? "Captura del sistema"}
      width={w}
      height={h}
      sizes={narrow ? "360px" : "(max-width: 860px) 100vw, 640px"}
      priority={priority}
    />
  )

  return (
    // `data-full` es el archivo original: la lupa lo usa para ampliar nítido,
    // en vez de escalar la versión reducida que se ve en pantalla.
    <figure ref={ref} className={clases.join(" ")} data-full={src}>
      <div className="shotbar" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>

      {/* Cuando la captura abre una ficha es un <button> de verdad y no un div
          con onClick: así se llega con el tabulador y responde a Enter, igual
          que el botón de al lado. La lupa sigue funcionando porque busca por
          la clase, no por la etiqueta. */}
      {abre ? (
        <button
          type="button"
          className="shotimg"
          onClick={() => abrirFicha(abre)}
          aria-label={etiqueta ? `Leer el caso: ${etiqueta}` : "Leer el caso"}
        >
          {imagen}
        </button>
      ) : (
        <div className="shotimg">{imagen}</div>
      )}

      {cap ? <figcaption>{cap}</figcaption> : null}
    </figure>
  )
}
