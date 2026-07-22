import { ImageResponse } from "next/og"
import { perfil, metricas } from "@/lib/content"
import { fuenteDisplay } from "./og-fuente"

/**
 * La tarjeta que aparece cuando el link se comparte por WhatsApp o LinkedIn.
 *
 * En este mercado el enlace se manda por WhatsApp casi siempre, así que esta
 * imagen es la primera impresión real de mucha gente — antes de entrar. Por eso
 * lleva las cifras: se lee entera sin abrir nada.
 */
export const alt = "Eduardo Vegas — convierto procesos manuales en sistemas que devuelven horas"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OpenGraphImage() {
  const display = await fuenteDisplay()

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(160deg, #16232F 0%, #0C141C 58%, #0A1017 100%)",
          color: "#DCE6EE",
          fontFamily: "Display",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 9, height: 9, borderRadius: 9, background: "#8FB8D8" }} />
          <div
            style={{
              fontSize: 21,
              letterSpacing: "0.16em",
              color: "#7B8D9C",
            }}
          >
            {`${perfil.lugar.toUpperCase()} — ${perfil.rol.toUpperCase()}`}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 40, color: "#9DB0BF", marginBottom: 14 }}>{perfil.nombre}</div>
          {/* Satori exige display explícito en cualquier div con más de un hijo,
              así que el titular va en filas en vez de texto con <span> dentro. */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 66,
              lineHeight: 1.16,
              letterSpacing: "-0.025em",
            }}
          >
            <div style={{ display: "flex" }}>Convierto procesos manuales en sistemas</div>
            <div style={{ display: "flex", gap: 18 }}>
              <div style={{ display: "flex" }}>que</div>
              <div style={{ display: "flex", color: "#B4D3EC" }}>devuelven horas.</div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 56, borderTop: "1px solid #24323E", paddingTop: 26 }}>
          {metricas.map((m) => (
            <div key={m.valor} style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 42, fontFamily: "monospace", letterSpacing: "-0.03em" }}>
                {m.valor}
              </div>
              <div style={{ fontSize: 19, color: "#7B8D9C", marginTop: 8, maxWidth: 210 }}>
                {m.corto}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Display", data: display, style: "normal", weight: 400 }] },
  )
}
