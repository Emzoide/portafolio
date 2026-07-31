"use client"

import type { Proyecto } from "@/lib/content"
import { Captura } from "@/components/site/captura"
import { useDialogo } from "./dialogo"

/**
 * El caso, en una burbuja de vidrio flotando sobre la página.
 *
 * Es la capa flotante del sistema, que es el único sitio donde el vidrio tiene
 * permiso de existir. Usa <dialog> nativo: foco atrapado, Escape y ::backdrop
 * gratis, sin librerías ni trampas de accesibilidad.
 */
export function CasoModal({ proyecto }: { proyecto: Proyecto }) {
  const { ref, abrir, cerrar } = useDialogo(proyecto.slug, proyecto.titulo)
  const caso = proyecto.caso

  if (!caso) return null

  return (
    <>
      <button type="button" className="read" onClick={abrir}>
        {/* En un span y no suelto: el resplandor que sigue al puntero va
            posicionado, y lo posicionado pinta por encima del texto en flujo. */}
        <span>Leer el caso</span>
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
