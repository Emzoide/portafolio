"use client"

import type { Nota } from "@/lib/content"
import { NotaModal } from "./nota-modal"
import { abrirFicha } from "./dialogo"

/**
 * El archivo: lo demás del trabajo, en una línea cada uno.
 *
 * Cada entrada abre su ficha corta. Son botones y no una tabla porque ahora se
 * pulsan, y un <tr> clicable no se puede recorrer con el teclado.
 */
export function ArchivoLista({ entradas }: { entradas: Nota[] }) {
  return (
    <ul className="idx">
      {entradas.map((a) => (
        <li key={a.slug}>
          <button type="button" onClick={() => abrirFicha(a.slug)}>
            <span className="yr">{a.anio}</span>
            <span className="nm">{a.nombre}</span>
            <span className="ds">{a.detalle}</span>
            <span className="st">{a.stack}</span>
          </button>
          <NotaModal nota={a} />
        </li>
      ))}
    </ul>
  )
}
