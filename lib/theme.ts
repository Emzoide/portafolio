/**
 * Paletas del sitio.
 *
 * Para cambiar el color de todo el portafolio, cambia ACTIVE_PALETTE.
 * Los valores viven en app/globals.css bajo [data-palette="..."] — aquí
 * solo está el registro, para que el switcher y el layout sepan qué existe.
 *
 * En desarrollo hay un selector flotante abajo a la derecha para probarlas
 * en vivo; no aparece en producción.
 */

export const PALETTES = [
  { id: "acero", nombre: "Acero", nota: "Azul frío industrial. El acento es la luz, no el tono." },
  { id: "petroleo", nombre: "Petróleo", nota: "Verde profundo oxidado, como cobre envejecido." },
  { id: "vino", nombre: "Vino", nota: "Borgoña oscuro con brasa. Cálido y adulto." },
  { id: "indigo", nombre: "Índigo", nota: "Noche azul con una luz cálida abajo." },
  { id: "bosque", nombre: "Bosque y latón", nota: "Verde casi negro con metal dorado." },
  { id: "cobre", nombre: "Cobre quemado", nota: "Marrón profundo con naranja de fragua." },
] as const

export type PaletteId = (typeof PALETTES)[number]["id"]

export const ACTIVE_PALETTE: PaletteId = "acero"
