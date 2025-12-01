# User Interface Design Goals

### Overall UX Vision
Proporcionar un flujo ultraligero: pegar enlace → ver estado de análisis → revisar un dashboard con resumen narrativo y tarjetas temáticas, manteniendo tono profesional pero amigable. _(Asumido: los usuarios priorizan rapidez sobre configuraciones avanzadas.)_

### Key Interaction Paradigms
- Carga de video mediante URL con validación instantánea.
- Barra de progreso y notificaciones durante el análisis.
- Dashboard con resumen ejecutivo, tarjetas temáticas, métricas de sentimiento y alertas.
- Controles de filtros (idioma, fecha) y regeneración rápida de resultados.

### Core Screens and Views
- Pantalla **Ingresar video** con formulario y CTA principal.
- Vista **Resultado del análisis** con resumen, temas y sentimientos.
- Modal/panel **Editar parámetros** para ajustes sin abandonar resultados.
- Sección **Historial** para análisis previos (opcional en roadmap).

### Accessibility: WCAG AA
Contrastes altos, navegación por teclado y descripciones textuales para visualizaciones; anuncios de estado compatibles con lectores de pantalla durante el análisis. _(Asumido: alineado con NFR3.)_

### Branding
Estilo neutro con acentos en colores de confianza (azules/amarillos). Se recomienda futura personalización con branding del creador. _(Asumido: no existe guía de marca.)_

### Target Device and Platforms: Web Responsive
Optimizado para desktop y tablet, con mobile simplificado para consulta rápida. _(Asumido: la captura de URL ocurre mayormente en desktop.)_
