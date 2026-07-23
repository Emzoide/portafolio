import Image from "next/image"

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
 * Algunas pruebas no son capturas puras del sistema sino correos o tarjetas de
 * cliente. En esos casos se puede pasar el tamaño real para que el navegador
 * reserve el alto correcto antes de cargar la imagen.
 */
export function Captura({
  src,
  cap,
  narrow = false,
  width,
  height,
  priority = false,
}: {
  src: string
  cap?: string
  narrow?: boolean
  width?: number
  height?: number
  priority?: boolean
}) {
  const [w, h] = [width ?? (narrow ? 722 : 1918), height ?? (narrow ? 880 : 976)]

  return (
    <figure className={narrow ? "shot narrow" : "shot"}>
      <div className="shotbar" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="shotimg">
        <Image
          src={src}
          alt={cap ?? "Captura del sistema"}
          width={w}
          height={h}
          sizes={narrow ? "360px" : "(max-width: 860px) 100vw, 640px"}
          priority={priority}
        />
      </div>
      {cap ? <figcaption>{cap}</figcaption> : null}
    </figure>
  )
}
