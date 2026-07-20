# GestionRenta

Multi-tenant SaaS para contadores colombianos. Gestión de declaraciones de renta con vencimientos por terminación de cédula, recordatorios vía WhatsApp y checklist de documentos por perfil DIAN.

## Stack

- Next.js 15 (App Router)
- Prisma + PostgreSQL
- Auth.js v5 (Credentials)
- Tailwind CSS
- Vitest

## Desarrollo

```bash
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

## Producción

```bash
docker compose up -d
```
