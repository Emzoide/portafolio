import { perfil, proyectos, archivo } from "@/lib/content"

/**
 * Aviso por correo cuando alguien abre un caso.
 *
 * Se dispara solo al abrir una ficha, no en cada visita: un sitio público
 * recibe crawlers todo el día y una notificación por visita se vuelve ruido que
 * se acaba silenciando. Abrir un caso casi nunca lo hace un bot.
 *
 * SOBRE LA SEGURIDAD
 *
 * El relay de correo vive en AVISO_ENDPOINT y solo se lee aquí, en el servidor:
 * nunca viaja al navegador, así que no aparece en la pestaña de red ni en el
 * código público. Pero esta ruta sí es pública, y sin defensas sería un
 * amplificador — no haría falta conocer el relay para inundarlo, bastaría con
 * repetir esta petición. De ahí las cuatro capas:
 *
 *  1. Lista blanca: el nombre del caso tiene que existir en el sitio. Nada de
 *     lo que escriba quien llame llega nunca al correo.
 *  2. Tope global por hora: pase lo que pase, el relay recibe como mucho ese
 *     número de correos.
 *  3. Silencio por visitante, para no repetir por recargas.
 *  4. Mismo origen: descarta el curl que no se moleste en falsear cabeceras.
 *
 * Y si el relay además valida un token (AVISO_TOKEN), se envía en la cabecera.
 */

/** Nombres que el sitio puede mandar. Cualquier otra cosa se descarta. */
const PERMITIDOS = new Set<string>([
  ...proyectos.map((p) => p.titulo),
  ...archivo.map((a) => a.nombre),
])

const SILENCIO = 30 * 60 * 1000 // por visitante
const TOPE_HORA = 20 // correos como máximo, pase lo que pase

const VISTOS = new Map<string, number>()
let ventana = { desde: 0, enviados: 0 }

function esRobot(ua: string) {
  return /bot|crawl|spider|slurp|preview|fetch|curl|wget|monitor|lighthouse|headless/i.test(ua)
}

function mismoOrigen(req: Request) {
  const host = req.headers.get("host")
  if (!host) return false
  const fuente = req.headers.get("origin") ?? req.headers.get("referer")
  if (!fuente) return false
  try {
    return new URL(fuente).host === host
  } catch {
    return false
  }
}

export async function POST(req: Request) {
  const endpoint = process.env.AVISO_ENDPOINT
  const destino = process.env.AVISO_CORREO ?? perfil.correo

  try {
    if (!mismoOrigen(req)) return Response.json({ ok: true, motivo: "otro origen" })

    const ua = req.headers.get("user-agent") ?? ""
    if (esRobot(ua)) return Response.json({ ok: true, motivo: "robot" })

    const { caso } = (await req.json()) as { caso?: unknown }
    // Se busca en la lista, no se usa lo recibido: al correo solo llega texto
    // que ya estaba en el sitio.
    const nombre = typeof caso === "string" ? [...PERMITIDOS].find((n) => n === caso) : undefined
    if (!nombre) return Response.json({ ok: true, motivo: "desconocido" })

    const ahora = Date.now()

    // Tope global: aunque alguien insista, el relay no se inunda.
    if (ahora - ventana.desde > 60 * 60 * 1000) ventana = { desde: ahora, enviados: 0 }
    if (ventana.enviados >= TOPE_HORA) return Response.json({ ok: true, motivo: "tope" })

    // Huella aproximada del visitante; no se guarda en ningún sitio, solo vive
    // en memoria mientras la función esté caliente.
    const quien = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "?"
    if (ahora - (VISTOS.get(quien) ?? 0) < SILENCIO) {
      return Response.json({ ok: true, motivo: "repetido" })
    }
    VISTOS.set(quien, ahora)

    if (!endpoint) return Response.json({ ok: true, motivo: "sin configurar" })

    const ciudad = req.headers.get("x-vercel-ip-city")
    const pais = req.headers.get("x-vercel-ip-country")
    const desde = [ciudad && decodeURIComponent(ciudad), pais].filter(Boolean).join(", ")
    const cuando = new Intl.DateTimeFormat("es-PE", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "America/Lima",
    }).format(new Date())

    const cabeceras: Record<string, string> = { "Content-Type": "application/json" }
    if (process.env.AVISO_TOKEN) cabeceras["X-API-Key"] = process.env.AVISO_TOKEN

    ventana.enviados += 1

    await fetch(endpoint, {
      method: "POST",
      headers: cabeceras,
      // Que un relay lento no deje la petición colgada.
      signal: AbortSignal.timeout(6000),
      body: JSON.stringify({
        to: [destino],
        from_name: "Portafolio",
        subject: `Abrieron tu caso: ${nombre}`,
        html: `<p>Alguien abrió el caso <strong>${nombre}</strong> en tu portafolio.</p>
               <p>${desde ? `Desde ${desde}<br>` : ""}${cuando}</p>
               <p><a href="https://eduardo-vegas.vercel.app">eduardo-vegas.vercel.app</a></p>`,
        text: [
          `Alguien abrió el caso "${nombre}" en tu portafolio.`,
          desde ? `Desde: ${desde}` : null,
          `Cuándo: ${cuando}`,
        ]
          .filter(Boolean)
          .join("\n"),
      }),
    })

    return Response.json({ ok: true })
  } catch {
    // Un fallo aquí no puede afectar a quien está viendo la página.
    return Response.json({ ok: true })
  }
}
