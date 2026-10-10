export const site = {
  nombre: "Qtech",
  claim: "Servicio técnico de aparatología estética",

  contacto: {
    email: "info@qtech.es",
    telefono: "+34 900 000 000",
    horario: "Lunes a viernes, 9:00 – 18:00",
    direccion: "Polígono Histórico, nave 14 · 28023 Madrid",
  },

  nav: [
    { ruta: "/", etiqueta: "Inicio" },
    { ruta: "/servicios", etiqueta: "Servicios" },
    { ruta: "/productos", etiqueta: "Productos" },
    { ruta: "/contacto", etiqueta: "Contacto" },
  ],

  familias: ["Prevención", "Reparación", "Reposición"],

  /* Catálogo de muestra: precios orientativos en euros, sin IVA. */
  servicios: [
    {
      titulo: "Mantenimiento preventivo",
      familia: "Prevención",
      destacado: true,
      descripcion:
        "Revisión completa con limpieza de cabezales, engrase de guías y calibración de potencia. Programamos la siguiente visita.",
      marcas: ["Lumenis", "Alma", "BTL", "Dornier"],
    },
    {
      titulo: "Reparación de diodo láser",
      familia: "Reparación",
      destacado: true,
      descripcion:
        "Sustitución del banco de diodos y verificación de divergencia y fluencia. Incluye prueba de salida en haz colimado.",
      marcas: ["Lumenis LightSheer", "Fotona", "Alma"],
    },
    {
      titulo: "Revisión de EMSculpt",
      familia: "Prevención",
      descripcion:
        "Comprobación de las ondas sincronizadas, calibración de pulsos y sustitución de acoplamiento gel.",
      marcas: ["BTL EMSCULPT"],
    },
    {
      titulo: "Recambio de cartuchos IPL",
      familia: "Reparación",
      descripcion:
        "Cartuchos de cristal y filtros de longitudes de onda con calibración de energía verificada en banco.",
      marcas: ["Lumenis", "Alma", "Poliplas"],
    },
    {
      titulo: "Asesoría y formación",
      familia: "Reposición",
      descripcion:
        "Acompañamiento al equipo médico para optimizar protocolos y rentabilizar sesiones.",
      marcas: [],
    },
    {
      titulo: "Puesta en marcha de equipo usado",
      familia: "Reposición",
      descripcion:
        "Transferencia de equipo overhaused: auditoría, traslado, instalación y formación al personal.",
      marcas: ["Multimarca"],
    },
  ],

  productos: [
    {
      ref: "CR-IPL-2F",
      nombre: "Cartucho IPL multifrecuencia",
      categoria: "Cartuchos",
      precio: 420,
      descripcion: "Compatible con plataformas Lumenis y Alma. Cristal de zafiro.",
    },
    {
      ref: "CR-DIO-975",
      nombre: "Cartucho diodo 975 nm",
      categoria: "Cartuchos",
      precio: 680,
      descripcion: "PuntaFG26 para equipos de láser de diodo de 975 nm.",
    },
    {
      ref: "PT-HIFU-14",
      nombre: "Punta HIFU 14 cartridges",
      categoria: "Puntas",
      precio: 390,
      descripcion: "Set de cartuchos lineales con marcaje de profundidad.",
    },
    {
      ref: "FL-OPT-480",
      nombre: "Filtro óptico 480 nm",
      categoria: "Filtros",
      precio: 95,
      descripcion: "Filtro de paso corto para tratamiento de vasos.",
    },
    {
      ref: "FL-OPT-690",
      nombre: "Filtro óptico 690 nm",
      categoria: "Filtros",
      precio: 110,
      descripcion: "Complemento para sesiones de depilación IPL.",
    },
    {
      ref: "MT-CHG-6A",
      nombre: "Módulo de carga rápida 6A",
      categoria: "Electrónica",
      precio: 275,
      descripcion: "Repuesto para plataforma con carga de batería externa.",
    },
    {
      ref: "AC-REF-3L",
      nombre: "Aceite de refrigeración 3 L",
      categoria: "Consumibles",
      precio: 48,
      descripcion: "Glycol de baja viscosidad para circuito de refrigeración.",
    },
    {
      ref: "AC-GEL-5L",
      nombre: "Gel de acoplamiento 5 L",
      categoria: "Consumibles",
      precio: 32,
      descripcion: "Gel conductor para aplicación en HIFU y EMSculpt.",
    },
  ],
};
