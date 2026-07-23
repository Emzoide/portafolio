"use client"

import { useEffect, useRef, useState } from "react"
import type { Proyecto } from "@/lib/content"
import { Captura } from "@/components/site/captura"

/**
 * El caso, en una burbuja de vidrio flotando sobre la página.
 *
 * Es la capa flotante del sistema, que es el único sitio donde el vidrio tiene
 * permiso de existir. Usa <dialog> nativo: foco atrapado, Escape y ::backdrop
 * gratis, sin librerías ni trampas de accesibilidad.
 */
export function CasoModal({ proyecto }: { proyecto: Proyecto }) {
  const ref = useRef<HTMLDialogElement>(null)
  const [abierto, setAbierto] = useState(false)
  const caso = proyecto.caso

  // El fondo no debe correr mientras la burbuja está abierta.
  useEffect(() => {
    document.documentElement.style.overflow = abierto ? "hidden" : ""
    return () => {
      document.documentElement.style.overflow = ""
    }
  }, [abierto])

  /**
   * Observamos el atributo `open` en vez de escuchar el evento `close`.
   *
   * `close` no burbujea, así que la delegación de React no lo ve y la prop
   * onClose no es fiable; además hay entornos donde ni siquiera se dispara.
   * El atributo, en cambio, siempre desaparece al cerrar — con Escape, con el
   * botón o con clic en el fondo. Sin esto, cerrar dejaba la página bloqueada
   * sin scroll, que es el peor fallo posible de un modal.
   */
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    const observador = new MutationObserver(() => setAbierto(dialog.open))
    observador.observe(dialog, { attributes: true, attributeFilter: ["open"] })
    return () => observador.disconnect()
  }, [])

  if (!caso) return null

  const abrir = () => {
    ref.current?.showModal()
    setAbierto(true)
  }
  const cerrar = () => {
    ref.current?.close()
  }

  return (
    <>
      <button type="button" className="read" onClick={abrir}>
        Leer el caso
      </button>

      <dialog
        ref={ref}
        className="modal"
        aria-labelledby={`${proyecto.slug}-titulo`}
        // Clic en el ::backdrop: el target es el propio dialog, no su contenido.
        onClick={(e) => {
          if (e.target === ref.current) cerrar()
        }}
      >
        <div className="modalin glass">
          <header>
            <p className="lab">{proyecto.contexto}</p>
            <h3 id={`${proyecto.slug}-titulo`}>{proyecto.titulo}</h3>
            <button type="button" className="cerrar" onClick={cerrar} aria-label="Cerrar el caso">
              <span aria-hidden="true">×</span>
            </button>
          </header>

          <div className="modalcuerpo">
            <h4>Cómo se trabajaba antes</h4>
            <p>{caso.antes}</p>

            <h4>{caso.decision.titulo}</h4>
            <p>{caso.decision.texto}</p>

            <h4>Qué resuelve</h4>
            <div className="partes">
              {caso.partes.map((parte) => (
                <div className="parte" key={parte.nombre}>
                  <div className="partetxt">
                    <dt>{parte.nombre}</dt>
                    <dd>{parte.texto}</dd>
                  </div>
                  {parte.imgs?.length ? (
                    <div className="parteshots">
                      {parte.imgs.map((im) => (
                        <Captura
                          key={im.src}
                          src={im.src}
                          cap={im.cap}
                          narrow={im.narrow}
                          width={im.width}
                          height={im.height}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            <dl className="ficha">
              <dt>Estado</dt>
              <dd data-estado={proyecto.estado.clave}>{proyecto.estado.texto}</dd>
              <dt>Mi rol</dt>
              <dd>{proyecto.rol}</dd>
              <dt>Código</dt>
              <dd>{proyecto.codigo.nota}</dd>
            </dl>
          </div>
        </div>
      </dialog>
    </>
  )
}
