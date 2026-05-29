# PESV Digital — Sistema de Gestión del Plan Estratégico de Seguridad Vial

**Resolución 40595 de 2022 | Ministerio de Transporte de Colombia**  
**Empresa caso:** TransCor S.A.S. · 25 conductores · 18 vehículos · Nivel Estándar

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS + Recharts + Zustand |
| Backend | Node.js 20 + Express.js + Prisma ORM |
| Base de datos | PostgreSQL 16 |
| IA | Claude (Anthropic) — claude-sonnet-4-20250514 |

---

## Instalación y puesta en marcha

### Requisitos previos
- Node.js 20+
- Docker Desktop (para PostgreSQL) **o** PostgreSQL instalado localmente
- Cuenta en [Anthropic Console](https://console.anthropic.com) para la API Key

---

### Paso 1 — Levantar la base de datos

```bash
# Con Docker (recomendado)
docker compose up -d

# Verificar que esté corriendo
docker ps
```

---

### Paso 2 — Configurar el backend

```bash
cd backend
npm install
```

Edita `backend/.env` y reemplaza tu clave API:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/pesv_db
JWT_SECRET=pesv_jwt_secret_2024_cambia_esto_en_produccion
JWT_EXPIRES_IN=7d
ANTHROPIC_API_KEY=sk-ant-api03-TU_CLAVE_REAL_AQUI
PORT=3001
NODE_ENV=development
```

```bash
# Generar cliente Prisma y aplicar esquema
npx prisma generate
npx prisma db push

# Cargar datos de prueba
npm run seed

# Iniciar servidor de desarrollo
npm run dev
```

El backend estará disponible en: http://localhost:3001  
Health check: http://localhost:3001/api/health

---

### Paso 3 — Configurar el frontend

```bash
cd frontend
npm install
npm run dev
```

La aplicación estará disponible en: http://localhost:5173

---

## Credenciales de acceso (seed)

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Administrador | admin@pesv.co | admin123 |
| Líder PESV | lider@pesv.co | lider123 |
| Gerente | gerente@pesv.co | gerente123 |
| Conductor | c1@pesv.co | cond123 |

---

## Módulos del sistema

| Módulo | Ruta | Paso PESV |
|--------|------|-----------|
| Dashboard | `/dashboard` | KPIs en tiempo real |
| Asistente IA | `/asistente` | Chat con Claude |
| Documentos | `/documentos` | Pasos 3, 6, 8, 20 |
| Riesgos | `/riesgos` | Pasos 5, 6, 7, 8 |
| Capacitaciones | `/capacitaciones` | Pasos 15-18 |
| Vehículos | `/vehiculos` | Paso 11 |
| Conductores | `/conductores` | Paso 14 |
| Incidentes | `/incidentes` | Paso 13 |

---

## Integración con Claude (IA)

El sistema usa la API de Claude para:

1. **Generar documentos PESV** — Política de Seguridad Vial, Procedimientos, Actas de Comité, Indicadores Paso 20
2. **Investigar incidentes** — Análisis de causas y acciones correctivas (Paso 13)
3. **Asistente normativo** — Chat especializado en Resolución 40595 de 2022
4. **Informes ejecutivos** — Resumen mensual del estado del PESV

---

## API Endpoints principales

```
POST /api/auth/login
GET  /api/auth/me

GET  /api/dashboard/kpis
GET  /api/dashboard/accidentalidad
GET  /api/dashboard/alertas

GET  /api/conductores
GET  /api/vehiculos
GET  /api/documentos
GET  /api/riesgos
GET  /api/riesgos/matriz
GET  /api/capacitaciones
GET  /api/incidentes
GET  /api/incidentes/estadisticas

POST /api/ia/generar-documento
POST /api/ia/consulta-normativa
POST /api/ia/investigar-incidente/:id
POST /api/ia/generar-informe-ejecutivo
```

---

## Cron Job — Alertas automáticas

El job `alertas.job.js` se ejecuta diariamente a las **6:00 AM (hora Bogotá)** y genera alertas cuando:

- SOAT o tecnomecánica de un vehículo vence en ≤30 días
- Licencia de conducción vence en ≤30 días
- Un incidente con estado REPORTADO lleva >7 días sin investigación

---

## Datos del seed

- **6 usuarios** (admin, líder, gerente, 3 conductores)
- **5 vehículos** (2 con SOAT vencido, alertas activas)
- **5 conductores** (1 con licencia vencida)
- **6 documentos** (varios estados y categorías)
- **6 riesgos** (incluyendo críticos)
- **4 capacitaciones** con inscripciones parciales
- **6 incidentes** de los últimos 6 meses
- **5 alertas** activas iniciales

---

*Proyecto Integrador · Ingeniería de Sistemas · PESV Digital v1.0*
