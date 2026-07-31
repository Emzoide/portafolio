"use client"

import { abrirFicha } from "./dialogo"

/**
 * Una cifra del hero. Es un botón: abre el trabajo que la sustenta, esté entre
 * los casos destacados o en el archivo.
 */
export function Cifra({ valor, nota, abre }: { valor: string; nota: string; abre: string }) {
  return (
    <button type="button" className="m" onClick={() => abrirFicha(abre)}>
      <b>{valor}</b>
      <span>{nota}</span>
    </button>
  )
}
