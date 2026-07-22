import Image from "next/image"
import { Grain } from "@/components/site/grain"
import { CasoModal } from "@/components/site/caso-modal"
import { GlassSpecular } from "@/components/site/glass-specular"
import { PaletteSwitcher } from "@/components/site/palette-switcher"
import {
  perfil,
  titular,
  metricas,
  proyectos,
  archivo,
  sobreMi,
  certificaciones,
  trayectoria,
} from "@/lib/content"

/**
 * Regla del sistema: el vidrio es jerarquía, no piel.
 * Solo flotan como vidrio la barra, la tira de métricas y el dock de cierre.
 * Todo el contenido — paneles, archivo, retrato — es opaco.
 */
export default function Home() {
  return (
    <>
      <section className="atmos">
        <Grain />

        <div className="navwrap">
          <div className="nav glass">
            <span className="mark">
              {perfil.nombre}
              <i>.</i>
            </span>
            <nav>
              <a href="#trabajo">Trabajo</a>
              <a href="#sobre-mi">Sobre mí</a>
              <a href="#contacto">Contacto</a>
            </nav>
            <a className="cta" href={`mailto:${perfil.correo}`}>
              Conversemos
            </a>
          </div>
        </div>

        <div className="page">
          <header className="hero">
            <div>
              <p className="lab loc">
                <span className="dot" aria-hidden="true" />
                {perfil.lugar} — {perfil.rol}
              </p>
              <h1>
                {titular.antes}
                <em>{titular.destacado}</em>
              </h1>
              <p>{titular.bajada}</p>
            </div>

            <figure className="retratowrap">
              <div className="retrato">
                {perfil.retrato ? (
                  <Image
                    src={perfil.retrato}
                    alt={`Retrato de ${perfil.nombre}`}
                    width={520}
                    height={650}
                    priority
                  />
                ) : (
                  <p className="falta">
                    Retrato
                    <br />
                    pendiente
                  </p>
                )}
              </div>
              <figcaption className="lab">
                {perfil.nombre} · {perfil.lugar}
              </figcaption>
            </figure>
          </header>

          <div className="strip glass">
            <div className="in">
              {metricas.map((m) => (
                <div className="m" key={m.valor}>
                  <b>{m.valor}</b>
                  <span>{m.nota}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="page body">
        <section id="trabajo">
          <div className="sechead">
            <h2>Trabajo seleccionado</h2>
            <span className="lab">2024 — 2026</span>
          </div>

          {proyectos.map((p) => (
            <article className="feat" key={p.slug}>
              <div>
                <p className="lab">{p.contexto}</p>
                <h3>{p.titulo}</h3>
                <p>{p.resumen}</p>

                <dl className="ficha">
                  <dt>Estado</dt>
                  <dd data-estado={p.estado.clave}>{p.estado.texto}</dd>
                  <dt>Mi rol</dt>
                  <dd>{p.rol}</dd>
                  <dt>Código</dt>
                  <dd>
                    {p.codigo.estado === "publico" && p.codigo.url ? (
                      <a href={p.codigo.url}>{p.codigo.nota}</a>
                    ) : (
                      p.codigo.nota
                    )}
                  </dd>
                </dl>

                <div className="tags">
                  {p.tags.map((t) => (
                    <span className="tag" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
                <CasoModal proyecto={p} />
              </div>

              <div className="panel">
                <div className="bar" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </div>
                {p.filas.map((f) => (
                  <div className="row" key={f.etiqueta}>
                    <span>{f.etiqueta}</span>
                    <b className={f.alto ? "up" : undefined}>{f.valor}</b>
                  </div>
                ))}
                <div className="track" aria-hidden="true">
                  <i style={{ width: `${p.progreso}%` }} />
                </div>
                {p.panelNota ? <p className="panelnota">{p.panelNota}</p> : null}
              </div>
            </article>
          ))}

          <table className="idx">
            <tbody>
              {archivo.map((a) => (
                <tr key={a.nombre}>
                  <td className="yr">{a.anio}</td>
                  <td className="nm">{a.nombre}</td>
                  <td className="ds">{a.detalle}</td>
                  <td className="st">{a.stack}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="about" id="sobre-mi">
          <div className="trayectoria">
            <p className="resumen">{trayectoria.resumen}</p>
            {trayectoria.vias.map((via) => (
              <div className="via" key={via.titulo}>
                <h3>{via.titulo}</h3>
                <ol>
                  {via.pasos.map((paso) => (
                    <li key={paso.cargo}>
                      <span className="fecha">{paso.fecha}</span>
                      <span className="cargo">{paso.cargo}</span>
                    </li>
                  ))}
                </ol>
                <p className="pie">{via.pie}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="lab">Sobre mí</p>
            <h2>{sobreMi.titulo}</h2>
            {sobreMi.parrafos.map((t) => (
              <p key={t.slice(0, 24)}>{t}</p>
            ))}
            <dl className="certs">
              <dt>Certificaciones</dt>
              {certificaciones.map((c) => (
                <dd key={c.nombre}>
                  {c.nombre} <span>{c.emisor}</span> <i>{c.anio}</i>
                </dd>
              ))}
            </dl>
          </div>
        </section>
      </main>

      <section className="close" id="contacto">
        <div className="page closein">
          <h2>{sobreMi.cierre}</h2>
          <p className="respuesta">{perfil.respuesta}</p>
          <div className="dock glass">
            <span>{perfil.disponible}</span>
            <a className="secundario" href={perfil.whatsapp}>
              WhatsApp
            </a>
            <a href={`mailto:${perfil.correo}`}>Escríbeme</a>
          </div>
        </div>
      </section>

      <footer className="page pie">
        <span>
          © {new Date().getFullYear()} {perfil.nombre} · {perfil.lugar}
        </span>
        <span>
          <a href={perfil.linkedin}>LinkedIn</a>
          <a href={perfil.github}>GitHub</a>
          <a href={`mailto:${perfil.correo}`}>Correo</a>
        </span>
      </footer>

      <GlassSpecular />
      <PaletteSwitcher />
    </>
  )
}
