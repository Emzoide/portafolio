/**
 * Todo el contenido del sitio vive aquí.
 *
 * La idea es que puedas editar textos, cifras y proyectos sin abrir un solo
 * componente. Los datos de ahora salen del CV 2026 y del portafolio anterior;
 * están marcados con TODO los que hay que reemplazar por los proyectos nuevos.
 */

export const perfil = {
  nombre: "Eduardo Vegas",
  lugar: "Piura, Perú",
  rol: "Ingeniero de sistemas",
  correo: "emzovg@gmail.com",
  linkedin: "https://linkedin.com/in/eduardo-vegas",
  github: "https://github.com/Emzoide",
  whatsapp: "https://wa.me/51920461960",
  disponible: "Piura · disponible para conversar",
  respuesta: "Suelo responder el mismo día.",
  // Mientras esté vacío se muestra el hueco marcado como pendiente.
  retrato: "/retrato.jpeg",
}

export const titular = {
  // El <em> se pinta con el color de acento.
  antes: "Convierto procesos manuales en sistemas que ",
  destacado: "devuelven horas.",
  // Ojo: esta bajada tiene que seguir siendo cierta cuando cambie el estado de
  // los proyectos. No prometas producción de algo que todavía no arranca.
  bajada:
    "Construyo integraciones, CRMs y agentes que reemplazan trabajo repetitivo. Dentro de una empresa automotriz con noventa asesores, y como freelance: el ecosistema completo con el que un taller arranca operaciones este agosto.",
}

/**
 * `nota` es la del sitio; `corto` la de la tarjeta de compartir, donde no cabe
 * la frase entera. Etiquetas escritas, no la nota recortada a lo bruto.
 */
export const metricas = [
  {
    valor: "900 h",
    nota: "Devueltas al mes tras digitalizar la gestión documental",
    corto: "Horas devueltas al mes",
  },
  {
    valor: "40 h",
    nota: "De reportes manuales eliminadas al mes por agentes",
    corto: "Reportes manuales eliminados",
  },
  {
    valor: "−40 %",
    nota: "Tiempo de respuesta a prospectos con el chatbot en el CRM",
    corto: "Tiempo de respuesta",
  },
  {
    valor: "+20 %",
    nota: "Entrada de leads tras rehacer los módulos comerciales",
    corto: "Entrada de leads",
  },
]

export type Fila = { etiqueta: string; valor: string; alto?: boolean }

export type Proyecto = {
  slug: string
  contexto: string
  titulo: string
  resumen: string
  /**
   * Distinguir lo que ya opera de lo que está construido y esperando arranque
   * es lo que hace creíble todo lo demás. El que borra la diferencia parece
   * que infla; el que la marca parece preciso.
   */
  estado: { clave: "produccion" | "listo"; texto: string }
  /**
   * Qué construiste tú, en concreto. No el cargo — la parte del sistema.
   * Cuando un proyecto es de varias manos, esto es lo que te separa del resto
   * del equipo, y lo que hace creíble que lo reclames.
   */
  rol: string
  /**
   * "cerrado" para sistemas internos que no puedes enseñar; "publico" con url
   * para los que sí. Declararlo pesa más que esconderlo.
   */
  codigo: { estado: "cerrado" | "publico"; nota: string; url?: string }
  tags: string[]
  filas: Fila[]
  progreso: number
  /** Nota bajo el panel. Úsala para decir que los datos son de demostración. */
  panelNota?: string
  // Cuando tengas la captura real: "/capturas/lo-que-sea.png"
  captura?: string
  /** El caso largo. Se despliega en la misma página, sin cambiar de ruta. */
  caso?: {
    antes: string
    decision: { titulo: string; texto: string }
    /** Cada parte puede llevar la captura que la prueba, justo debajo del texto.
     *  `narrow` para pantallas verticales (vista del cliente), que no deben
     *  estirarse a todo el ancho. `width` y `height` fijan la proporción real
     *  cuando la captura no coincide con el formato horizontal principal. */
    partes: {
      nombre: string
      texto: string
      imgs?: { src: string; cap: string; narrow?: boolean; width?: number; height?: number }[]
    }[]
  }
}

export const proyectos: Proyecto[] = [
  {
    slug: "red-automotriz",
    contexto: "Freelance · Red Automotriz",
    titulo: "El ecosistema con el que un taller deja de trabajar en papel",
    estado: { clave: "listo", texto: "Construido y entregado · arranca en agosto de 2026" },
    resumen:
      "Una empresa me buscó para que le construyera el sistema con el que iba a operar su taller. Vehículos, clientes, órdenes de trabajo, stock, facturación electrónica ante SUNAT, atención por WhatsApp y fidelización, en un solo ecosistema. Lo diseñé, lo construí y lo entregué solo.",
    rol: "Todo: arquitectura, base de datos, backend, interfaz, integraciones y despliegue.",
    codigo: { estado: "cerrado", nota: "Sistema del cliente · código cerrado" },
    tags: ["Next.js", "PostgreSQL", "Prisma", "SUNAT", "WhatsApp Cloud API", "Docker"],
    filas: [
      { etiqueta: "Órdenes de trabajo abiertas", valor: "9" },
      { etiqueta: "Comprobantes aceptados por SUNAT", valor: "24 / 24", alto: true },
      { etiqueta: "Repuestos bajo stock mínimo", valor: "3" },
      { etiqueta: "Conversaciones sin responder", valor: "2" },
    ],
    progreso: 88,
    panelNota: "Datos de demostración",
    // Portada del proyecto: reemplaza el panel maquetado por la captura real.
    captura: "/capturas/red-siluetas.png",
    caso: {
      antes:
        "Cuadernos, Excel y Google Sheets, WhatsApp Business por un lado, las hojas de SUNAT por otro, planillas hechas a mano con calculadora, un almacén entero dedicado a guardar papel — y gritos de un extremo del taller al otro para saber si una unidad ya estaba lista.",
      decision: {
        titulo: "El asistente de WhatsApp funciona de dos modos",
        texto:
          "Atiende con inteligencia artificial, y es conmutable a un flujo de reglas configurables con solo cambiar la configuración — sin tocar el código. Para agendar citas, el flujo guiado tiene una virtud que conviene poder elegir: no improvisa una fecha ni ofrece algo que el taller no pueda cumplir. Que el sistema soporte los dos modos deja la decisión en manos de quien lo opera, según la temporada y el volumen de conversaciones.",
      },
      partes: [
        {
          nombre: "Operación del taller",
          texto:
            "Clientes, vehículos y órdenes de trabajo con su historial. Quién trajo la unidad, qué se le hizo, qué repuesto se usó y en qué quedó. En la recepción, el estado del vehículo se registra sobre siluetas, daño por daño.",
          imgs: [
            {
              src: "/capturas/red-siluetas.png",
              cap: "Recepción: daños e inventario del vehículo",
              width: 1918,
              height: 976,
            },
            {
              src: "/capturas/red-banda.png",
              cap: "Banda de obra — el taller en tiempo real",
              width: 1918,
              height: 975,
            },
          ],
        },
        {
          nombre: "Facturación electrónica",
          texto:
            "Comprobantes emitidos y validados contra SUNAT desde el mismo flujo que cierra la orden, sin volver a escribir los datos en otra hoja.",
        },
        {
          nombre: "WhatsApp como bandeja",
          texto:
            "Los chats llegan por WhatsApp Cloud API a una bandeja donde un mensaje se convierte en prospecto y un prospecto en cliente, sin salir del sistema.",
          imgs: [
            {
              src: "/capturas/red-bandeja.png",
              cap: "Bandeja de WhatsApp: bot, ventana de 24h y toma humana",
              width: 1918,
              height: 981,
            },
            {
              src: "/capturas/red-embudo.png",
              cap: "El embudo, por canal de entrada",
              width: 1915,
              height: 973,
            },
          ],
        },
        {
          nombre: "Alertas que salen solas",
          texto:
            "Al administrador le avisan cuando un repuesto baja del mínimo. Al cliente le avisan cuando su vehículo está listo para recoger, y le llegan sus documentos por correo.",
          imgs: [
            {
              src: "/capturas/red-vehiculo-listo.png",
              cap: "Correo automático cuando la unidad queda lista para entrega",
              width: 632,
              height: 592,
            },
          ],
        },
        {
          nombre: "Fidelización",
          texto:
            "Tarjetas, encuestas y seguimiento para que el taller sepa a quién le toca volver, en vez de esperar a que aparezca.",
          imgs: [
            {
              src: "/capturas/red-fidelizacion.png",
              cap: "Tarjeta de cliente: visitas, premio y QR de canje",
              narrow: true,
              width: 673,
              height: 870,
            },
            {
              src: "/capturas/red-encuesta.png",
              cap: "Encuesta postservicio enviada por correo",
              width: 637,
              height: 462,
            },
          ],
        },
        {
          nombre: "La web pública",
          texto:
            "También les hice el sitio, conectado al mismo sistema: el cliente agenda su cita desde ahí, la cita entra directo a la operación del taller, y desde la misma web sigue el avance de su vehículo en vivo.",
          imgs: [
            {
              src: "/capturas/red-web.png",
              cap: "La web pública, conectada al CRM",
              width: 1855,
              height: 958,
            },
            {
              src: "/capturas/red-seguimiento.png",
              cap: "El cliente sigue su vehículo en tiempo real",
              narrow: true,
              width: 722,
              height: 880,
            },
          ],
        },
      ],
    },
  },
  {
    slug: "ausentismo-rotacion",
    // Deliberadamente sin nombrar al cliente: el encargo vino de una persona
    // del equipo, no de la empresa, y son datos de personal de miles de
    // trabajadores. La escala impresiona más que el nombre y no expone a nadie.
    contexto: "Freelance · Agroexportadora en Piura",
    titulo: "El cruce manual de asistencia de ~4.700 personas, resuelto en segundos",
    estado: { clave: "produccion", texto: "En uso · reemplazó el cruce manual mensual" },
    resumen:
      "El área de RR.HH. de una agroindustrial con cerca de 4.700 trabajadores controlaba el ausentismo cruzando a mano, cada mes, dos Excel de miles de filas. Le construí una herramienta de escritorio que se abre con doble clic —sin instalar nada, sin internet, sin costo de operación—: se arrastra el archivo de marcaciones y en segundos salen el ausentismo, la rotación y las alertas de personal en riesgo de cese.",
    rol: "Todo: análisis del formato del agrodata, motor de cálculo, interfaz, gráficos y empaquetado.",
    codigo: { estado: "cerrado", nota: "Herramienta del cliente · código cerrado" },
    tags: ["Python", "http.server", "JS vanilla", "SVG a mano", "PyInstaller"],
    filas: [
      { etiqueta: "Registros por carga", valor: "~90 000" },
      { etiqueta: "Tiempo de cálculo", valor: "0,2 s", alto: true },
      { etiqueta: "Antes, con Power Query", valor: "+7 min" },
      { etiqueta: "Costo de operación", valor: "S/ 0" },
    ],
    progreso: 24,
    panelNota: "Datos de demostración",
    captura: "/capturas/ausentismo/aus-resumen.png",
    caso: {
      antes:
        "Cada mes, alguien descargaba la base de marcaciones y la cruzaba a mano en Excel. Con esa cantidad de filas cualquier cálculo masivo se arrastraba, no dejaba ver tendencias ni comparar periodos, y armar el reporte costaba horas propensas a error.",
      decision: {
        titulo: "Por qué un ejecutable y no una hoja de cálculo",
        texto:
          "El primer intento fue por Power Query, el camino natural para un área que vivía en Excel. Con el volumen real se colgaba más de siete minutos: ese trabajo no es de una hoja de cálculo. Lo llevé a un ejecutable portable que corre un servidor local y abre una interfaz en el navegador — sin instalar nada, sin internet y sin costo. Y como son datos de personal, esa decisión tiene un segundo motivo: la información nunca sale de la PC de la analista.",
      },
      partes: [
        {
          nombre: "Personal en riesgo de cese",
          texto:
            "El ranking de quiénes se acercan al límite de faltas, según el criterio laboral que se configure —faltas seguidas, mensuales, el umbral que aplique—, antes de que el plazo se cumpla.",
          imgs: [
            {
              src: "/capturas/ausentismo/aus-riesgo.png",
              cap: "Personal en riesgo, ordenado por faltas",
              width: 1915,
              height: 975,
            },
          ],
        },
        {
          nombre: "El calendario de cada trabajador",
          texto:
            "Una ficha por persona con su asistencia día a día: faltas, descansos, licencias y su racha, para sustentar cada decisión con el detalle a la vista.",
          imgs: [
            {
              src: "/capturas/ausentismo/aus-ficha.png",
              cap: "Ficha individual con calendario de asistencia",
              width: 1030,
              height: 981,
            },
          ],
        },
        {
          nombre: "Comparar periodos, con memoria",
          texto:
            "Guarda el histórico de cada carga y compara solo: una semana contra la anterior, un mes contra otro o el rango que se elija. El ausentismo y la rotación dejan de ser una foto y pasan a ser una tendencia.",
          imgs: [
            {
              src: "/capturas/ausentismo/aus-resumen.png",
              cap: "Resumen del periodo: ausentismo, rotación y movimiento",
              width: 1913,
              height: 977,
            },
          ],
        },
        {
          nombre: "Cómo se cuenta cada día",
          texto:
            "Cada código del agrodata es configurable —si se espera trabajo ese día, si suma como falta o como ausencia justificada— y el criterio de cese se ajusta sin tocar el código. La regla del negocio vive en la configuración, no en el programa.",
          imgs: [
            {
              src: "/capturas/ausentismo/aus-config.png",
              cap: "Significado y peso de cada código de asistencia",
              width: 1915,
              height: 967,
            },
          ],
        },
        {
          nombre: "Cargar y exportar",
          texto:
            "Se arrastra el mismo archivo que RR.HH. ya descargaba, sin cambiarles el proceso de origen. La salida va a CSV listo para Excel o Power BI, con el detalle completo cuando hace falta.",
          imgs: [
            {
              src: "/capturas/ausentismo/aus-carga.png",
              cap: "Periodos cargados y formatos de exportación",
              width: 1918,
              height: 973,
            },
          ],
        },
      ],
    },
  },
  {
    slug: "agentes-financieros",
    // Presentado como capacidad/demo: es un agente en uso real, pero aquí se
    // muestra con un dataset ficticio y sin colgarlo de un cliente.
    estado: { clave: "listo", texto: "Demo interactivo · datos ficticios" },
    contexto: "Agente de datos con IA",
    titulo: "Un agente que consulta la base, hace el análisis y recomienda",
    resumen:
      "En vez de un tablero con preguntas fijas, un agente que se conecta a la base de datos, escribe su propia consulta, ejecuta el análisis en Python y responde la pregunta que se le acaba de ocurrir a quien decide: proyecta demanda, simula escenarios con su impacto en margen y detecta stock inmovilizado. Lo uso para eliminar la generación manual de reportes; aquí corre sobre datos de demostración.",
    rol: "Diseño del agente: conexión a datos, generación de consultas, análisis en Python y la capa de recomendación.",
    codigo: { estado: "cerrado", nota: "Agente propio · código cerrado" },
    tags: ["Python", "SQL", "Claude", "Análisis de datos"],
    filas: [
      { etiqueta: "Reportes manuales eliminados", valor: "sí", alto: true },
      { etiqueta: "Consulta la base", valor: "en vivo" },
      { etiqueta: "Escribe su propio SQL", valor: "sí" },
      { etiqueta: "Análisis en Python", valor: "al momento" },
    ],
    progreso: 73,
    panelNota: "Datos de demostración",
    captura: "/capturas/agentes/agent-1.png",
    caso: {
      antes:
        "Cada reporte se armaba a mano: alguien consultaba la base, exportaba a Excel y construía el análisis desde cero, otra vez, cada vez. Era lento y solo respondía la pregunta que ya sabías hacer — para una nueva, vuelta a empezar.",
      decision: {
        titulo: "Por qué un agente y no otro tablero",
        texto:
          "Un tablero responde preguntas fijas; el negocio hace preguntas nuevas. El agente conecta a la base, redacta su propia consulta y corre el análisis en el momento, así que contesta lo que se le pregunta, no lo que alguien previó hace meses. Y muestra su trabajo —la consulta, los pasos del cálculo— para que sea auditable y no una caja negra: cada número se puede rastrear hasta la fila que lo generó.",
      },
      partes: [
        {
          nombre: "Consulta la base y escribe su SQL",
          texto:
            "Entiende la pregunta en lenguaje natural, redacta la consulta contra el ERP o el data warehouse y trae los datos. La consulta queda a la vista: se ve exactamente qué le preguntó a la base.",
          imgs: [
            {
              src: "/capturas/agentes/agent-2.png",
              cap: "El agente redacta y ejecuta su propia consulta SQL",
              width: 1443,
              height: 972,
            },
          ],
        },
        {
          nombre: "Proyecta y simula escenarios",
          texto:
            "Sobre el histórico corre regresión con tendencia y estacionalidad para proyectar demanda, y simula escenarios —una promoción, un cambio de precio— con su efecto en unidades, venta y margen antes de tomarlos.",
          imgs: [
            {
              src: "/capturas/agentes/agent-1.png",
              cap: "Proyección de demanda y simulación de un 2x1 con impacto en margen",
              width: 1353,
              height: 975,
            },
          ],
        },
        {
          nombre: "Analiza y recomienda una acción",
          texto:
            "No se queda en el número: cruza rotación y capital inmovilizado, señala lo que está frenado y recomienda la acción concreta —qué SKU liquidar, qué proveedor renegociar— con el detalle que la sustenta.",
          imgs: [
            {
              src: "/capturas/agentes/agent-3.png",
              cap: "Análisis de rotación y recomendación de qué liquidar",
              width: 1355,
              height: 973,
            },
          ],
        },
      ],
    },
  },
]

/**
 * Lo demás de Interamericana, mencionado sin desarrollar. Tres casos completos
 * y una lista pesan más que cinco casos compitiendo entre ellos.
 */
export const archivo = [
  {
    anio: "2025",
    nombre: "CRM comercial unificado",
    detalle: "Agendamiento, prospectos, postventa y facturación conectados al ERP por API REST",
    stack: "Laravel · React",
  },
  {
    anio: "2025",
    nombre: "Digitalización documental",
    detalle: "Diez horas al mes recuperadas por cada uno de los noventa asesores",
    stack: "PHP · S3",
  },
  {
    anio: "2025",
    nombre: "Plataforma de integraciones",
    detalle: "Un punto de entrada único para CRM, agendamiento y proveedores externos",
    stack: "FastAPI",
  },
  {
    anio: "2025",
    nombre: "Chatbot comercial con IA",
    detalle: "Atiende fuera de horario y escala a un humano cuando corresponde",
    stack: "Python",
  },
  {
    anio: "2024",
    nombre: "Catálogo digital interactivo",
    detalle: "Visualización de vehículos con panel administrativo propio",
    stack: "Laravel · JS",
  },
  {
    anio: "2024",
    nombre: "Sitio comercial y microservicios",
    detalle: "Core Web Vitals de 61 a 90 y nuevos módulos de venta",
    stack: "JS · Angular",
  },
]

/**
 * Trayectoria en dos vías, no una escalera de cargos.
 *
 * Lo interesante no es la antigüedad — es que mientras creces dentro de una
 * empresa, otras te contratan por tu cuenta al mismo tiempo.
 */
export const trayectoria = {
  resumen: "De practicante a desarrollador de I+D en menos de dos años.",
  vias: [
    {
      titulo: "En la empresa",
      pie: "Interamericana Norte · Piura",
      pasos: [
        { fecha: "Oct 2024", cargo: "Practicante de inteligencia comercial" },
        { fecha: "Feb 2025", cargo: "Asistente de programación" },
        { fecha: "May 2026", cargo: "Desarrollador de investigación y desarrollo" },
      ],
    },
    {
      titulo: "Por mi cuenta",
      pie: "Clientes que me buscaron directamente",
      pasos: [
        { fecha: "2026", cargo: "Ecosistema completo para un taller" },
        { fecha: "2026", cargo: "Plataforma de ausentismo y rotación" },
      ],
    },
  ],
}

export const sobreMi = {
  titulo: "El trabajo de una persona debería ser pensar, no hacer",
  parrafos: [
    "Lo primero que automaticé fueron los precios de un concesionario. Había que entrar a cada una de las quinientas versiones de vehículo, una por una, y copiar su precio desde un Excel a la pantalla que le tocaba. Lo que hice fue dejar que ese mismo Excel —el que ya llenaban— se cargara al administrador y se cruzara solo con el ID de cada auto. Suena simple, y lo es. Devolvió una cantidad de horas que todavía me sorprende.",
    "Desde entonces me cuesta dar algo por terminado. Cuando miro un sistema que ya funciona, lo que encuentro son aristas: lo que todavía se le puede agregar para que el proceso sea mejor. Completo no llega a estar nunca, porque siempre aparece algo nuevo — y esa es justamente la parte que me gusta.",
    "De ahí sale mi forma de trabajar. Cuando alguien se pasa la mañana copiando datos de una pantalla a otra, no está usando lo único que una máquina no le puede dar, que es criterio. Mi trabajo es quitarle esa mañana de encima.",
    "En los encargos por mi cuenta eso se vuelve más claro todavía: quien me contrata tiene un negocio que atender, no un sistema que operar. Así que la pregunta que me hago, y me la hago muchas veces seguidas, es qué arista falta para que la operación siga sola y lo único que quede sobre su mesa sea lo que de verdad necesita su cabeza.",
    "Soy bachiller en Ingeniería de Sistemas por la Universidad Tecnológica del Perú. Casi todo lo demás lo aprendí construyendo cosas que alguien necesitaba el lunes.",
  ],
  cierre: "¿Tienes un proceso que todavía se hace a mano?",
}

/**
 * En una línea sobria, no en tarjetas ni barras de porcentaje. Un certificado
 * dice lo que hiciste; un "React 92 %" no dice nada y se nota.
 */
export const certificaciones = [
  { nombre: "Claude Code", emisor: "Anthropic", anio: "2026" },
  { nombre: "Foundational C#", emisor: "Microsoft · freeCodeCamp", anio: "2025" },
  { nombre: "Cloud Computing: AWS · Azure · GCP", emisor: "UNI", anio: "2025" },
]
