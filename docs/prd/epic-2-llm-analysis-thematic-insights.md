# Epic 2: LLM Analysis & Thematic Insights

### Epic Goal
Desarrollar la capa analítica que agrupa comentarios, detecta sentimiento y genera resúmenes explicativos configurables.

#### Story 2.1 Preprocesamiento y Configuración
As a developer,
I want normalizar comentarios (idioma, spam, parámetros) antes del análisis,
so that el LLM reciba datos consistentes y ajustables.

1. Detección automática de idioma con opción de filtro.
2. Eliminación de spam/duplicados y normalización de texto.
3. Preferencias de sensibilidad persistidas y expuestas a la UI.

#### Story 2.2 Agrupamiento Temático y Sentimiento
As a creator,
I want ver grupos temáticos con frecuencia y sentimiento asociado,
so that entienda qué opina la audiencia.

1. Agrupamiento con etiquetas claras y porcentaje por tema.
2. Cada tema incluye sentimiento y comentarios representativos.
3. Resultados almacenados para regeneración sin reingestión.

#### Story 2.3 Resumen Narrativo con LLM
As a creator,
I want un resumen narrativo que explique hallazgos y recomiende acciones,
so that actúe rápidamente sobre los insights.

1. Prompt template produce secciones (elogios, críticas, recomendaciones, debates) con trazabilidad.
2. Reintentos exponenciales ante fallos del LLM y mensajes claros al usuario.
3. Logs registran IDs de prompt/respuesta y métricas de tokens.
