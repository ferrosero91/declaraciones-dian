-- AlterTable: Reemplazar completado por estado_declaracion
ALTER TABLE "clientes" ADD COLUMN "estado_declaracion" TEXT NOT NULL DEFAULT 'pendiente';
ALTER TABLE "clientes" ADD COLUMN "fecha_completado" TIMESTAMP(3);

-- Migrar datos existentes: completado=true -> elaborada
UPDATE "clientes" SET "estado_declaracion" = 'elaborada', "fecha_completado" = NOW() WHERE "completado" = true;

-- Eliminar columna antigua
ALTER TABLE "clientes" DROP COLUMN "completado";
