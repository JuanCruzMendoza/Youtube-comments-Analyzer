# Technical Assumptions

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
