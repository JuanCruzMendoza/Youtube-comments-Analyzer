# Operational & Monitoring Requirements
- Despliegues continuos (al menos 1 vez por semana) con rollback automatizado.
- Panel de observabilidad centralizado (logs, métricas de cuota, costos LLM) con alertas a Slack/email.
- Playbook de soporte con tiempos de respuesta: 4 h incidentes críticos, 1 día incidentes mayores.
- Registro de incidentes y análisis post-mortem obligatorio para fallos de disponibilidad.
- Procedimiento de escalamiento cuando cuota restante <25 % del día (activación de backups o aviso a usuarios).
