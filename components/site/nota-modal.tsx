"use client"

import type { Nota } from "@/lib/content"
import { useDialogo } from "./dialogo"

/**
 * La ficha corta de una entrada del archivo: solo texto.
 *
 * Deliberadamente más sobria que el caso de un proyecto destacado —sin
 * capturas, sin partes— para que amplíe lo justo sin robarle protagonismo a
 * los tres casos.
 */
export function NotaModal({ nota }: { nota: Nota }) {
  const { ref, cerrar } = useDialogo(nota.slug, nota.nombre)

  return (
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby={`${nota.slug}-titulo`}
      // Clic en el ::backdrop: el target es el propio dialog, no su contenido.
      onClick={(e) => {
        if (e.target === ref.current) cerrar()
      }}
    >
      <div className="modalin glass nota">
        <header>
          <p className="lab">{nota.contexto}</p>
          <h3 id={`${nota.slug}-titulo`}>{nota.nombre}</h3>
          <button type="button" className="cerrar" onClick={cerrar} aria-label="Cerrar la ficha">
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <div className="modalcuerpo">
          {nota.parrafos.map((t) => (
            <p key={t.slice(0, 24)}>{t}</p>
          ))}

          <dl className="ficha">
            <dt>Año</dt>
            <dd>{nota.anio}</dd>
            <dt>Stack</dt>
            <dd>{nota.stack}</dd>
            <dt>Código</dt>
            <dd>
              {nota.codigo?.url ? (
                <a href={nota.codigo.url} target="_blank" rel="noreferrer">
                  {nota.codigo.nota}
                </a>
              ) : (
                (nota.codigo?.nota ?? "Sistema interno · código cerrado")
              )}
            </dd>
          </dl>
        </div>
      </div>
    </dialog>
  )
}
