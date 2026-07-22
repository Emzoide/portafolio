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
    partes: { nombre: string; texto: string }[]
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
            "Clientes, vehículos y órdenes de trabajo con su historial. Quién trajo la unidad, qué se le hizo, qué repuesto se usó y en qué quedó.",
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
        },
        {
          nombre: "Alertas que salen solas",
          texto:
            "Al administrador le avisan cuando un repuesto baja del mínimo. Al cliente le avisan cuando su vehículo está listo para recoger, y le llegan sus documentos por correo.",
        },
        {
          nombre: "Fidelización",
          texto:
            "Tarjetas y seguimiento para que el taller sepa a quién le toca volver, en vez de esperar a que aparezca.",
        },
        {
          nombre: "La web pública",
          texto:
            "También les hice el sitio, conectado al mismo sistema: el cliente agenda su cita desde ahí y la cita entra directo a la operación del taller.",
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
    titulo: "Tres días de Excel convertidos en un tablero que carga en segundos",
    estado: { clave: "produccion", texto: "En uso · versión web desde 2026" },
    resumen:
      "Con cerca de 9.700 trabajadores marcando cuatro veces al día, medir ausentismo y rotación en una hoja de cálculo dejó de ser viable. El área tardaba unos tres días en armar el reporte. Ahora suben el mismo Excel que ya descargaban y el tablero sale solo.",
    rol: "Todo: análisis del formato del agrodata, motor de cálculo, plataforma web y despliegue.",
    codigo: { estado: "cerrado", nota: "Sistema del cliente · código cerrado" },
    tags: ["Python", "Pandas", "Plataforma web", "Excel"],
    filas: [
      { etiqueta: "Filas procesadas por carga", valor: "89 547" },
      { etiqueta: "Tiempo de proceso", valor: "segundos", alto: true },
      { etiqueta: "Ausentismo del periodo", valor: "23,8 %" },
      { etiqueta: "Rotación del mes", valor: "1,2 %" },
    ],
    progreso: 24,
    panelNota: "Datos de demostración",
    caso: {
      antes:
        "Alguien descargaba a diario la base desde el sistema externo y la peleaba en Excel, en Google Sheets o en Power BI. Con esa cantidad de marcaciones, cualquier cálculo masivo se arrastraba o se colgaba, y tener el reporte del periodo costaba alrededor de tres días de trabajo.",
      decision: {
        titulo: "Por qué no bastaba con arreglar el Excel",
        texto:
          "Primero se intentó por Power Query, que era el camino natural para un área que ya vivía en Excel. Con las 89.547 filas reales se colgaba más de siete minutos en las laptops del equipo, y el problema no era la fórmula: ese volumen no es trabajo de una hoja de cálculo. Moví el cálculo fuera de Excel y dejé Excel donde sí sirve — como el archivo que ellos ya sabían descargar y que ahora solo tienen que soltar en la plataforma.",
      },
      partes: [
        {
          nombre: "Quién está por cesar",
          texto:
            "La alerta principal: quiénes se están acercando al límite de faltas injustificadas, con nombre y cuenta, antes de que el plazo se cumpla.",
        },
        {
          nombre: "Ausentismo entre dos fechas",
          texto:
            "El porcentaje del periodo que se elija, con atajos para la semana pasada o la semana en curso, sin tener que rearmar nada.",
        },
        {
          nombre: "Rotación",
          texto:
            "Cuánta gente hay hoy frente a cuánta habrá mañana, que en un padrón altamente rotativo es el número que decide si se contrata o no.",
        },
        {
          nombre: "La carga",
          texto:
            "Suben el mismo archivo que ya descargaban del sistema externo. No hubo que cambiarles el proceso de origen ni pedirle nada a otro proveedor.",
        },
      ],
    },
  },
  {
    slug: "agentes-financieros",
    estado: { clave: "produccion", texto: "En producción desde 2025" },
    contexto: "Interamericana Norte · En producción",
    titulo: "Agentes financieros que leen la base de datos en vivo",
    resumen:
      "Cronogramas de crédito vehicular, cálculo de mora y alertas de cartera que antes eran una hoja de cálculo actualizada a mano cada semana. El agente consulta Oracle, calcula al momento y avisa antes de que la cuota venza.",
    rol: "Diseño del cálculo, capa de acceso a Oracle y el motor de alertas.",
    codigo: { estado: "cerrado", nota: "Sistema interno · código cerrado" },
    tags: ["Python", "FastAPI", "OracleDB", "Claude"],
    filas: [
      { etiqueta: "Cartera vigente", valor: "S/ 4 812 900" },
      { etiqueta: "Cuotas por vencer · 7 días", valor: "38" },
      { etiqueta: "En mora > 30 días", valor: "12", alto: true },
      { etiqueta: "Alertas enviadas hoy", valor: "26" },
    ],
    progreso: 73,
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
