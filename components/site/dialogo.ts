"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Plomería compartida por los dos tipos de ventana: el caso completo de un
 * proyecto destacado y la nota corta de una entrada del archivo.
 *
 * Cualquier parte de la página puede pedir que se abra una ficha por su slug
 * —lo usan las cifras del hero, para que ningún número quede sin explicación—,
 * así que el aviso viaja por un evento y no por props encadenadas.
 */

const EVENTO = "ficha:abrir"

export function abrirFicha(slug: string) {
  document.dispatchEvent(new CustomEvent(EVENTO, { detail: slug }))
}

export function useDialogo(slug: string) {
  const ref = useRef<HTMLDialogElement>(null)
  const [abierto, setAbierto] = useState(false)

  /**
   * El fondo no debe correr mientras hay una ventana abierta. Se mira si queda
   * alguna abierta en vez de fiarse del estado propio: al saltar de una ficha a
   * otra, la que se cierra y la que se abre se pisarían el candado.
   */
  useEffect(() => {
    document.documentElement.style.overflow = document.querySelector("dialog[open]")
      ? "hidden"
      : ""
    return () => {
      document.documentElement.style.overflow = ""
    }
  }, [abierto])

  /**
   * Se observa el atributo `open` en vez de escuchar el evento `close`: ese
   * evento no burbujea, la delegación de React no lo ve y hay entornos donde
   * ni siquiera se dispara — y entonces la página quedaba bloqueada sin scroll.
   */
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    const observador = new MutationObserver(() => setAbierto(dialog.open))
    observador.observe(dialog, { attributes: true, attributeFilter: ["open"] })
    return () => observador.disconnect()
  }, [])

  useEffect(() => {
    const alPedir = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== slug) return
      // Nunca dos ventanas a la vez.
      document.querySelectorAll<HTMLDialogElement>("dialog[open]").forEach((d) => {
        if (d !== ref.current) d.close()
      })
      ref.current?.showModal()
    }
    document.addEventListener(EVENTO, alPedir)
    return () => document.removeEventListener(EVENTO, alPedir)
  }, [slug])

  return {
    ref,
    abierto,
    abrir: () => ref.current?.showModal(),
    cerrar: () => ref.current?.close(),
  }
}
