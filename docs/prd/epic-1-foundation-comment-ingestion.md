# Epic 1: Foundation & Comment Ingestion

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
