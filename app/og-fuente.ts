import { readFile } from "node:fs/promises"
import { join } from "node:path"

/**
 * Fuente para las imágenes generadas (icono y tarjeta de compartir).
 *
 * Va empaquetada en el repo, no se descarga en tiempo de ejecución: Instrument
 * Serif es OFL, así que distribuirla es legal y evita depender de la red al
 * construir. Además hace falta pasarla de forma explícita — @vercel/og resuelve
 * mal la ruta de su fuente por defecto en Windows y revienta el render.
 */
export async function fuenteDisplay() {
  return readFile(join(process.cwd(), "app/fonts/InstrumentSerif-Regular.ttf"))
}
