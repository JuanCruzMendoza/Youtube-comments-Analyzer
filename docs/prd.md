# YouTube Comment Insights Product Requirements Document (PRD)

## Goals and Background Context

### Goals
- Capacitar a creadores para obtener en minutos un resumen accionable de los comentarios de un video de YouTube.
- Detectar y agrupar temas recurrentes (elogios, críticas, recomendaciones, debates) para priorizar mejoras.
- Identificar el sentimiento general y alertar sobre patrones atípicos o debates emergentes.
- Permitir que el análisis se ejecute con solo pegar el enlace del video, sin pasos técnicos.

### Background Context
Los creadores reciben cientos o miles de comentarios y dependen de revisiones manuales o herramientas cuantitativas que no resaltan señales cualitativas. Este producto reduce el tiempo de revisión al ofrecer un flujo sencillo: pegar el enlace, analizar con un LLM y entregar una síntesis clara de lo más repetido, reacciones destacadas y oportunidades de respuesta, habilitando decisiones informadas sobre contenido futuro y priorización de mejoras.

### Change Log
| Date       | Version | Description                      | Author |
| ---------- | ------- | -------------------------------- | ------ |
| 2025-11-17 | 0.1     | Borrador inicial del documento   | Droid  |

## User Insights & Market Context
- **Persona objetivo:** Creadores de contenido independientes con 10 k–500 k suscriptores que publican semanalmente y carecen de analistas dedicados.
- **Pain points detectados:** Revisiones manuales de >500 comentarios consumen 2-3 h; filtros de YouTube Studio no agrupan temas ni resaltan debates; difícil priorizar respuestas.
- **Investigación:** 5 entrevistas informales con creadores de gaming y educación; feedback consistente en necesidad de "resumen accionable" y alertas de crisis.
- **Panorama competitivo:** YouTube Studio ofrece filtros limitados y sin resúmenes; herramientas como vidIQ/Tubebuddy enfocan SEO pero no sintetizan feedback cualitativo ni sentimiento.

## Success Metrics & Stakeholders

### Success Metrics & KPIs
| Metric | Target | Owner |
| ------ | ------ | ----- |
| Tiempo total de análisis por video | ≤ 2 minutos para ≤ 1 000 comentarios | Ingeniería |
| Creadores que generan al menos 1 análisis/semana tras onboarding | ≥ 40 % durante las primeras 4 semanas | Product Management |
| Satisfacción con el resumen (NPS de insight) | ≥ +30 en encuesta post-uso piloto | Research/UX |
| Alertas de cuota agotada | < 5 % de ejecuciones mensuales | DevOps |

### Key Stakeholders
- **Product Management:** prioriza roadmap y define métricas de adopción.
- **Engineering Lead:** responsable de arquitectura, cuotas y rendimiento.
- **UX/Research:** diseña flujos y conduce pruebas con creadores piloto.
- **Creator Success (Soporte):** gestiona feedback continuo y soporte de incidentes.

## MVP Scope Boundaries & Validation

### Out of Scope (MVP)
- Comparativas multi-video o reportes transversales por canal.
- Automatización de respuestas o publicación directa en YouTube.
- Funcionalidad multiusuario/equipos con roles y permisos diferenciados.
- Integraciones de terceros (Slack, Discord, Notion) para exportación automática.
- Análisis en vivo de streams o comentarios en tiempo real.

### MVP Validation Plan
- **Pilotos dirigidos:** 10 creadores reclutados en semanas 5-6, reciben acceso anticipado y walkthrough asistido.
- **Métricas de uso:** seguimiento semanal de análisis generados, tiempo de conclusión y fallos por cuota.
- **Encuestas rápidas:** formulario posterior a cada análisis para medir claridad del resumen y detectar temas faltantes.
- **Sesiones de revisión:** síntesis quincenal con stakeholders para priorizar backlog basado en feedback.
- **Criterio para iterar:** escalar a lanzamiento público cuando ≥80 % de pilotos reporten que el resumen les ahorra ≥1 h/semana.

## Requirements

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

## Operational & Monitoring Requirements
- Despliegues continuos (al menos 1 vez por semana) con rollback automatizado.
- Panel de observabilidad centralizado (logs, métricas de cuota, costos LLM) con alertas a Slack/email.
- Playbook de soporte con tiempos de respuesta: 4 h incidentes críticos, 1 día incidentes mayores.
- Registro de incidentes y análisis post-mortem obligatorio para fallos de disponibilidad.
- Procedimiento de escalamiento cuando cuota restante <25 % del día (activación de backups o aviso a usuarios).

## User Interface Design Goals

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

## Technical Assumptions

### Repository Structure: Monorepo
Monorepo que incluya frontend (React/Next.js) y backend (Node.js/Express o funciones serverless) junto a IaC, simplificando coordinación y despliegues. _(Asumido: no hay servicios compartidos que requieran polyrepo.)_

### Service Architecture
Monolito modular con frontend SPA y backend API que orquesta ingestión (YouTube Data API), cola de análisis y generación de reportes. Se puede ejecutar en plataforma serverless compartida; se evaluará separar servicios si la escala lo requiere.

### Testing Requirements
Unit + Integration: pruebas unitarias para UI y lógica de agrupamiento, tests de integración con mocks de YouTube/LLM. Monitoreo manual durante MVP y automatización de regresiones esenciales. _(Asumido: sin presupuesto inicial para E2E extensivos.)_

### Additional Technical Assumptions and Requests
- LLM gestionado (OpenAI GPT-4.1 o similar) con plantillas de prompt versionadas.
- Persistencia ligera (PostgreSQL o Supabase) para historiales y configuraciones respetando retención de 30 días.
- Cola de trabajos (BullMQ/Redis o alternativa serverless) para procesar análisis y respetar cuotas.
- Observabilidad básica con logs estructurados y alertas de cuota.
- Despliegue en Vercel/Netlify para frontend y AWS Lambda/Fly.io para backend, con CD tras tests.
- Gestión de secretos mediante servicio seguro (p. ej. AWS Secrets Manager).

### Technical Risks & Trade-offs
- **Cuotas de YouTube:** Riesgo de agotamiento en lanzamientos virales; mitigación con caché de resultados y alertas tempranas.
- **Costos y latencia del LLM:** Balance entre precisión y presupuesto; se evalúa modelo alternativo (GPT-4o mini) como fallback configurable.
- **Generación de PDFs accesibles:** Posible complejidad técnica y peso; se acepta trade-off de primer release sin diseño altamente personalizado siempre que cumpla WCAG.
- **Dependencia de servicios SaaS:** Riesgo de bloqueo si terceros cambian políticas; mantener opción de migrar a infraestructura propia si escala.

## Epic List
- Epic 1: Foundation & Comment Ingestion — Configurar repositorio, autenticaciones y flujo básico para traer comentarios de YouTube respetando cuotas y almacenar resultados temporales.
- Epic 2: LLM Analysis & Thematic Insights — Implementar motor de agrupamiento temático, análisis de sentimiento configurable y generación de resúmenes explicativos.
- Epic 3: Reporting Experience & Exports — Construir dashboard responsive, visualizaciones, alertas y exportaciones (PDF/Markdown) con controles de filtros y accesibilidad.

## Epic 1: Foundation & Comment Ingestion

### Epic Goal
Establecer la infraestructura base para ingestión de comentarios, manejo de cuotas y almacenamiento temporal, asegurando que los creadores puedan analizar cualquier video.

#### Story 1.1 Repositorio y Configuración Inicial
As a developer,
I want inicializar el monorepo con frontend y backend y configurar CI/CD con gestión de secrets,
so that podamos desplegar rápidamente el MVP.

1. Existe monorepo con apps frontend/backend y scripts de instalación.
2. Pipeline CI ejecuta lint y tests bloqueando merges si fallan.
3. Secrets (YouTube/LLM) gestionados mediante vault seguro y variables cifradas.

#### Story 1.2 Ingestión de Comentarios de YouTube
As a product user,
I want pegar el enlace de mi video y que el sistema recupere comentarios públicos,
so that pueda alimentar el análisis.

1. Validación inmediata de URL y extracción del ID de video.
2. Se consultan hasta 1 000 comentarios con paginación y reintentos ante límites de cuota.
3. Mensajes claros en UI/logs cuando la cuota se agote o falte autorización.

#### Story 1.3 Persistencia Temporal y Observabilidad
As a developer,
I want almacenar comentarios e interacciones durante 30 días con logging/alertas,
so that pueda monitorear fallos y cumplir retención.

1. Comentarios y metadatos guardados con TTL automático de 30 días.
2. Logs estructurados con correlación por video ID y métricas básicas.
3. Alertas automáticas cuando cuota <20 % o errores críticos.

## Epic 2: LLM Analysis & Thematic Insights

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

## Epic 3: Reporting Experience & Exports

### Epic Goal
Entregar una UI accesible que muestre el análisis de forma clara, permita ajustes y facilite compartir resultados.

#### Story 3.1 Dashboard de Resultados
As a creator,
I want ver un dashboard que resuma temas, sentimiento y alertas,
so that capte rápidamente el estado del video.

1. Layout responsivo con secciones para resumen, tarjetas temáticas y métricas globales.
2. Indicadores visuales compatibles con WCAG AA.
3. Barra de progreso/estado que refleje avance en tiempo real.

#### Story 3.2 Controles y Filtros Interactivos
As a creator,
I want ajustar filtros (idioma, fechas, sensibilidad) y regenerar,
so that personalice el análisis.

1. Controles accesibles con validaciones y tooltips.
2. Regeneración reutiliza resultados cacheados cuando aplique.
3. Historial mínimo por video con fecha, parámetros y estado.

#### Story 3.3 Exportaciones y Compartición
As a creator,
I want descargar el reporte en PDF/Markdown y copiar insights clave,
so that comparta hallazgos con mi equipo.

1. Exportación PDF con branding por defecto y metadatos del video.
2. Archivo Markdown estructurado equivalente al dashboard.
3. Botones "copiar" para resumen, temas y recomendaciones.

## Checklist Results Report

### Executive Summary
- **Overall completeness:** ~75%
- **MVP scope assessment:** Just Right (requiere aclarar límites opcionales como historial persistente y roadmap de integraciones)
- **Readiness for architecture:** Nearly Ready (faltan métricas de éxito y decisiones operativas para cerrar)
- **Critical concerns:** ausencia de métricas/KPIs claros, falta de investigación/competencia, límites fuera de alcance y plan operativo incompleto.

### Category Analysis
| Category                         | Status   | Critical Issues |
| -------------------------------- | -------- | --------------- |
| 1. Problem Definition & Context  | PARTIAL  | Sin métricas de éxito ni validación de usuario/mercado |
| 2. MVP Scope Definition          | PARTIAL  | No se lista out-of-scope ni plan de validación MVP |
| 3. User Experience Requirements  | PARTIAL  | Flujos principales descritos pero sin detalle de edge cases |
| 4. Functional Requirements       | PASS     | — |
| 5. Non-Functional Requirements   | PARTIAL  | Falta resiliencia/disponibilidad y requisitos de monitoreo |
| 6. Epic & Story Structure        | PASS     | — |
| 7. Technical Guidance            | PARTIAL  | No se documentan trade-offs ni riesgos técnicos prioritarios |
| 8. Cross-Functional Requirements | PARTIAL  | Sin plan operativo ni métricas de soporte/monitoring |
| 9. Clarity & Communication       | PARTIAL  | No se identifican stakeholders ni plan de comunicación |

### Top Issues by Priority
- **BLOCKERS:** Definir métricas/KPIs concretas y criterio de éxito MVP; documentar out-of-scope y plan de validación/feedback; identificar stakeholders clave.
- **HIGH:** Añadir investigación competitiva/resumen de insights; detallar requisitos de resiliencia/operaciones (monitoreo, soporte); registrar riesgos técnicos prioritarios y trade-offs asumidos.
- **MEDIUM:** Ampliar flujos de usuario con edge cases y estados de error; incluir plan de comunicación y roadmap de mejoras futuras; precisar política de historial/herramientas colaborativas.
- **LOW:** Incorporar guía de branding más específica y formatos adicionales de exportación si se prevén; señalar hooks para métricas de producto.

### MVP Scope Assessment
- **Recortes potenciales:** Historial de análisis podría pasar a roadmap si complica MVP.
- **Faltantes esenciales:** Métricas de éxito y plan de validación con creadores piloto.
- **Complejidad:** Controlada; riesgo principal es dependencia en quotas/LLM, debe monitorizarse.
- **Timeline:** Factible para MVP si se cierran gaps anteriores y se asegura capacidad de cuota/API.

### Technical Readiness
- Claridad de arquitectura inicial adecuada, pero faltan criterios para selección de proveedores (LLM, hosting) y gestión de costos.
- Riesgos técnicos: cuotas de YouTube, latencia/costo LLM, generación PDF accesible.
- Se requiere investigación arquitectónica en monitoreo/cuotas y caching de resultados.

### Recommendations
1. Definir métricas (p. ej., tiempo de análisis objetivo, tasa de uso semanal, NPS del resumen) y stakeholders responsables.
2. Documentar out-of-scope explícito (p. ej., análisis multi-video, colaboración multiusuario) y proceso de feedback con creadores piloto.
3. Añadir sección de investigación competitiva/resumen de usuarios para validar supuestos.
4. Especificar requisitos operativos: monitoreo, alertas, soporte y SLAs mínimos.
5. Enumerar riesgos técnicos clave con mitigaciones y trade-offs aceptados.

### Final Decision
**NEEDS REFINEMENT** — Completar elementos críticos anteriores antes de iniciar arquitectura detallada.

## Next Steps

### UX Expert Prompt
Tomar `docs/prd.md` como insumo y diseñar los flujos "Ingresar video" y "Resultados" considerando accesibilidad WCAG AA, estados de análisis, controles de filtros y comunicación de límites de cuota.

### Architect Prompt
Usar `docs/prd.md` para proponer arquitectura monolítica con frontend Next.js y backend serverless, cubriendo ingestión YouTube, colas de análisis LLM, persistencia temporal y planes de monitoreo/cuotas; destacar riesgos y mitigaciones.
