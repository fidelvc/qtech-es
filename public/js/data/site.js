export const site = {
  name: "Qtech",
  tagline: "Servicio técnico multimarca de aparatología estética",

  summary:
    "Mantenimiento preventivo, correctivo, paliativo y adaptativo de IPL, láser de " +
    "diodo, picosegundo, EMSculpt, criolipólisis y diatermia, entre otros. Equipos " +
    "multimarca y de marca blanca.",

  contact: {
    email: "qtech.servicios@gmail.com",
    phone: "662 93 00 58",
    phoneRaw: "+34662930058",
    hours: "Lunes a viernes, 9:00 – 15:00",
    address: {
      street: "Carrer de la Duana, 3",
      postalCode: "08003",
      city: "Barcelona",
      region: "Cataluña",
      country: "ES",
    },
    zone: "Barcelona y área metropolitana",
    responseTime: "Respuesta en menos de 24 horas laborables",
  },

  nav: [
    { path: "/", label: "Inicio" },
    { path: "/servicios", label: "Servicios" },
    { path: "/productos", label: "Productos" },
    { path: "/contacto", label: "Contacto" },
  ],

  /* Maintenance types (service filters). */
  families: ["Preventivo", "Correctivo", "Paliativo", "Adaptativo"],

  services: [
    {
      title: "Mantenimiento preventivo de IPL",
      family: "Preventivo",
      featured: true,
      description:
        "Limpieza de cabezales y filtros, engrase de guías, revisión del circuito de " +
        "refrigeración y calibración de potencia. Incluye informe y planificación de " +
        "la siguiente visita.",
      equipment: ["IPL"],
    },
    {
      title: "Mantenimiento preventivo de láser de diodo",
      family: "Preventivo",
      description:
        "Medición de potencia, control de la refrigeración por agua o Peltier y " +
        "revisión del camino óptico y del brazo articulado.",
      equipment: ["Diodo"],
    },
    {
      title: "Mantenimiento preventivo de picosegundo",
      family: "Preventivo",
      description:
        "Revisión del láser, control del sistema de refrigeración, limpieza de óptica " +
        "y verificación de la energía por disparo.",
      equipment: ["Picosegundo"],
    },
    {
      title: "Mantenimiento preventivo de EMSculpt",
      family: "Preventivo",
      description:
        "Verificación de aplicadores, membranas y cables; calibración de pulsos " +
        "sincronizados y comprobación de seguridad eléctrica.",
      equipment: ["EMSculpt"],
    },
    {
      title: "Mantenimiento preventivo de criolipólisis",
      family: "Preventivo",
      description:
        "Control de vacío, membranas, temperaturas y ciclos de frío; revisión de fugas " +
        "y del estado del compresor.",
      equipment: ["Criolipólisis"],
    },
    {
      title: "Mantenimiento preventivo de diatermia",
      family: "Preventivo",
      description:
        "Revisión de aplicadores capacitivos y resistivos, calibración de temperatura " +
        "y comprobación de seguridad eléctrica.",
      equipment: ["Diatermia"],
    },
    {
      title: "Reparación de IPL",
      family: "Correctivo",
      featured: true,
      description:
        "Sustitución de módulos de disparo, condensadores y fuentes; prueba de salida " +
        "en banco y verificación de la fluencia.",
      equipment: ["IPL"],
    },
    {
      title: "Reparación de láser de diodo y picosegundo",
      family: "Correctivo",
      featured: true,
      description:
        "Sustitución de bancos de diodos y celdas Q-switch, realineado del camino " +
        "óptico y ajuste de la energía por disparo.",
      equipment: ["Diodo", "Picosegundo"],
    },
    {
      title: "Reparación de EMSculpt y electroestimulación",
      family: "Correctivo",
      description:
        "Diagnóstico de canales HF, sustitución de cableado y electrodos, y " +
        "calibración de los pulsos sincronizados.",
      equipment: ["EMSculpt"],
    },
    {
      title: "Reparación de criolipólisis",
      family: "Correctivo",
      description:
        "Recarga de gas, sustitución de compresores y membranas, y verificación de los " +
        "ciclos de frío y vacío.",
      equipment: ["Criolipólisis"],
    },
    {
      title: "Reparación de diatermia y radiofrecuencia",
      family: "Correctivo",
      description:
        "Sustitución de etapas de potencia RF, calibración de temperatura y revisión de " +
        "aplicadores capacitivos y resistivos.",
      equipment: ["Diatermia"],
    },
    {
      title: "Reparación paliativa para no parar la clínica",
      family: "Paliativo",
      description:
        "Intervención rápida que devuelve el equipo a servicio de forma provisional " +
        "mientras llega el recambio o se planifica la reparación definitiva.",
      equipment: ["Multimarca"],
    },
    {
      title: "Adaptación y puesta a punto de equipos",
      family: "Adaptativo",
      description:
        "Retrofit de componentes, adaptación de repuestos compatibles, actualización de " +
        "software y puesta en marcha de equipos de segunda mano.",
      equipment: ["Multimarca", "Marca blanca"],
    },
  ],

  /* Replacement parts and consumables. No prices: they are quoted on request. */
  products: [
    {
      ref: "CR-IPL-2F",
      name: "Cartucho IPL multifrecuencia",
      category: "Cartuchos",
      description: "Compatible con plataformas multimarca. Cristal de zafiro.",
    },
    {
      ref: "CR-IPL-3F",
      name: "Cartucho IPL trifrecuencia",
      category: "Cartuchos",
      description: "Selector de tres longitudes de onda para tratamientos combinados.",
    },
    {
      ref: "PT-DIO-808",
      name: "Punta de diodo 808 nm",
      category: "Puntas",
      description: "Punta de alta potencia con refrigeración integrada.",
    },
    {
      ref: "PT-DIO-975",
      name: "Punta de diodo 975 nm",
      category: "Puntas",
      description: "Para plataformas de láser de diodo de 975 nm.",
    },
    {
      ref: "PT-HIFU-14",
      name: "Punta HIFU de 14 cartuchos",
      category: "Puntas",
      description: "Set de cartuchos lineales con marcaje de profundidad.",
    },
    {
      ref: "FL-OPT-480",
      name: "Filtro óptico 480 nm",
      category: "Filtros",
      description: "Filtro de paso corto para tratamiento vascular.",
    },
    {
      ref: "FL-OPT-690",
      name: "Filtro óptico 690 nm",
      category: "Filtros",
      description: "Complemento para sesiones de depilación IPL.",
    },
    {
      ref: "MD-QSW-1064",
      name: "Celda Q-switch 1064 nm",
      category: "Módulos",
      description: "Recambio para plataformas de picosegundo y Q-switched.",
    },
    {
      ref: "MD-RF-300",
      name: "Etapa de potencia RF 300 W",
      category: "Módulos",
      description: "Módulo de radiofrecuencia para equipos de diatermia.",
    },
    {
      ref: "MD-CHG-6A",
      name: "Módulo de carga rápida 6 A",
      category: "Módulos",
      description: "Repuesto para plataforma con carga de batería externa.",
    },
    {
      ref: "MB-CRIO-U",
      name: "Membrana de criolipólisis universal",
      category: "Consumibles",
      description: "Membrana de recambio para aplicadores de frío controlado.",
    },
    {
      ref: "AC-GEL-5L",
      name: "Gel de acoplamiento 5 L",
      category: "Consumibles",
      description: "Gel conductor para HIFU, EMSculpt y radiofrecuencia.",
    },
    {
      ref: "AC-REF-3L",
      name: "Aceite de refrigeración 3 L",
      category: "Consumibles",
      description: "Glicol de baja viscosidad para circuito de refrigeración.",
    },
    {
      ref: "CB-EMT-PAR",
      name: "Cable de aplicador EMS (par)",
      category: "Accesorios",
      description: "Par de cables de conexión para cánulas de electroestimulación.",
    },
  ],

  /* How the work is organised: review and diagnosis come first. */
  process: [
    {
      title: "Contacto y datos del equipo",
      description: "Me cuentas marca, modelo y avería por teléfono o correo.",
    },
    {
      title: "Revisión",
      description:
        "Compruebo el estado general del equipo y sus parámetros de funcionamiento.",
    },
    {
      title: "Diagnóstico y presupuesto",
      description:
        "Identifico la causa y te envío un presupuesto cerrado antes de intervenir.",
    },
    {
      title: "Mantenimiento",
      description:
        "Aplico el servicio que corresponda: preventivo, correctivo, paliativo o " +
        "adaptativo.",
    },
    {
      title: "Pruebas y entrega",
      description:
        "Verifico potencia, calibración y seguridad antes de devolver el equipo.",
    },
    {
      title: "Seguimiento y garantía",
      description:
        "La intervención queda cubierta por 12 meses y hago seguimiento del equipo.",
    },
  ],

  guarantees: [
    {
      title: "12 meses de garantía",
      description:
        "En reparaciones y repuestos, con factura y condiciones por escrito.",
    },
    {
      title: "Pruebas en banco",
      description:
        "Cada equipo y cada pieza se verifica antes de salir del taller.",
    },
    {
      title: "Presupuesto cerrado",
      description:
        "Conoces el importe antes de intervenir; no hay cargos por sorpresa.",
    },
  ],

  logistics: [
    {
      title: "Recogida y entrega",
      description:
        "Servicio de mensajería asegurada de ida y vuelta al taller.",
    },
    {
      title: "Servicio in situ",
      description:
        "Intervenciones en la clínica dentro de Barcelona y área metropolitana.",
    },
    {
      title: "Embalaje y seguro",
      description:
        "Embalaje específico para equipos y cobertura durante el transporte.",
    },
  ],

  /* Labour rates. VAT is not included. */
  pricing: [
    {
      concept: "Mano de obra",
      price: "45 €/hora",
      note: "IVA no incluido.",
    },
    {
      concept: "Presupuesto",
      price: "Sin compromiso",
      note: "Cerrado antes de intervenir.",
    },
    {
      concept: "Desplazamiento",
      price: "Según zona",
      note: "Barcelona y área metropolitana.",
    },
  ],

  faqs: [
    {
      question: "¿Trabajas con equipos multimarca o de marca blanca?",
      answer:
        "Sí. Trabajo con todo tipo de plataformas multimarca y de marca blanca; no " +
        "estoy atado a un fabricante concreto.",
    },
    {
      question: "¿Qué tipos de mantenimiento ofreces?",
      answer:
        "Preventivo, correctivo, paliativo y adaptativo. La revisión y el diagnóstico " +
        "son siempre el punto de partida.",
    },
    {
      question: "¿Cada cuánto conviene hacer el mantenimiento?",
      answer:
        "Revisión anual en equipos de uso intensivo y semestral en plataformas de IPL " +
        "compartidas entre varias salas.",
    },
    {
      question: "¿Qué cubre la garantía?",
      answer:
        "12 meses en la reparación y en los repuestos, siempre con factura y " +
        "condiciones por escrito.",
    },
    {
      question: "¿Recoges y entregas el equipo?",
      answer:
        "Sí, con mensajería asegurada de ida y vuelta. También hago servicio in situ en " +
        "Barcelona y área metropolitana.",
    },
    {
      question: "¿Cómo se calcula el precio?",
      answer:
        "La mano de obra se factura a 45 €/hora + IVA. Antes de intervenir recibes un " +
        "presupuesto cerrado con piezas y mano de obra.",
    },
    {
      question: "¿Atiendes fuera de Barcelona?",
      answer:
        "El taller está en Barcelona; para otras zonas gestiono el transporte del " +
        "equipo.",
    },
  ],

  cta: {
    title: "¿Tu equipo no funciona?",
    text:
      "Cuéntame marca, modelo y avería. Te doy un diagnóstico y un presupuesto sin " +
      "compromiso.",
    button: "Pedir presupuesto",
  },
};
