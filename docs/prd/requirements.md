# Requirements

### Functional
- FR1: La aplicación debe aceptar un enlace de YouTube, recuperar los comentarios públicos y manejar cuotas/paginación de la API con reintentos y mensajes claros cuando se alcance el límite.
- FR2: El sistema debe agrupar comentarios por temas con parámetros configurables (idioma, sensibilidad) y mostrar la frecuencia relativa de cada grupo.
- FR3: Debe generar un resumen en lenguaje natural explicando por qué cada tema fue destacado e incluyendo ejemplos representativos.
- FR4: Debe calcular el sentimiento predominante por tema, mostrar muestras de apoyo y permitir ajustar umbrales para clasificaciones dudosas.
- FR5: Debe ofrecer la exportación del reporte en PDF y Markdown, y permitir copiar fragmentos clave en un solo clic.

### Non Functional
- NFR1: Para videos de hasta 1 000 comentarios y hasta 3 análisis concurrentes, el procesamiento completo debe tardar menos de 2 minutos usando batching y colas internas.
- NFR2: Los datos se cifrarán en tránsito y en reposo, con eliminación automática a los 30 días y alertas si hay retención prolongada.
- NFR3: La interfaz será Web Responsive con cumplimiento WCAG AA y soporte bilingüe (ES/EN) tanto en UI como en análisis.
- NFR4: El sistema debe tolerar fallos de API externa o LLM con al menos 3 reintentos exponenciales y fallback de mensajes al usuario sin perder contexto.
- NFR5: Deben existir dashboards y alertas automáticas (latencia, cuota, costos LLM) con monitoreo 24/7 y tiempo de respuesta inicial <4 h hábiles.
