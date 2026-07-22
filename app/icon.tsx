import { ImageResponse } from "next/og"
import { fuenteDisplay } from "./og-fuente"

// Favicon generado desde el código, no un .ico suelto que se queda viejo.
export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default async function Icon() {
  const display = await fuenteDisplay()

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A1017",
          color: "#DCE6EE",
          fontSize: 21,
          fontFamily: "Display",
          letterSpacing: "-0.03em",
        }}
      >
        E
        <span style={{ color: "#8FB8D8" }}>.</span>
      </div>
    ),
    { ...size, fonts: [{ name: "Display", data: display, style: "normal", weight: 400 }] },
  )
}
