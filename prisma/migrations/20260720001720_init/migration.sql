-- CreateTable
CREATE TABLE "contadores" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "nombre_completo" TEXT,
    "telefono" TEXT,
    "emailVerified" TIMESTAMP(3),
    "imagen" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cuentas" (
    "id" TEXT NOT NULL,
    "contadorId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "cuentas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sesiones" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "contadorId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sesiones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens_verificacion" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "configuracion_contador" (
    "id" TEXT NOT NULL,
    "contador_id" TEXT NOT NULL,
    "umbral_urgente_dias" INTEGER NOT NULL DEFAULT 5,
    "umbral_proximo_dias" INTEGER NOT NULL DEFAULT 15,
    "umbral_vigilar_dias" INTEGER NOT NULL DEFAULT 30,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracion_contador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" TEXT NOT NULL,
    "contador_id" TEXT NOT NULL,
    "nombre_completo" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "celular_whatsapp" TEXT,
    "tipo_ingresos" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "completado" BOOLEAN NOT NULL DEFAULT false,
    "notas" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calendario_vencimientos" (
    "id" TEXT NOT NULL,
    "anio_gravable" INTEGER NOT NULL,
    "terminacion_inicio" INTEGER NOT NULL,
    "terminacion_fin" INTEGER NOT NULL,
    "fecha_vencimiento" DATE NOT NULL,
    "origen" TEXT NOT NULL DEFAULT 'manual',
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calendario_vencimientos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cargas_calendario" (
    "id" TEXT NOT NULL,
    "contador_id" TEXT,
    "anio_gravable" INTEGER NOT NULL,
    "nombre_archivo" TEXT NOT NULL,
    "filas_importadas" INTEGER NOT NULL,
    "filas_con_error" INTEGER NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'procesado',
    "importado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cargas_calendario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plantillas_mensaje" (
    "id" TEXT NOT NULL,
    "contador_id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "nivel_urgencia" TEXT NOT NULL DEFAULT 'cualquiera',
    "cuerpo_texto" TEXT NOT NULL,
    "usar_ia" BOOLEAN NOT NULL DEFAULT false,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plantillas_mensaje_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentos_por_perfil" (
    "id" TEXT NOT NULL,
    "tipo_ingresos" TEXT NOT NULL,
    "documento" TEXT NOT NULL,
    "obligatorio" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documentos_por_perfil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "envios_log" (
    "id" TEXT NOT NULL,
    "contador_id" TEXT NOT NULL,
    "cliente_id" TEXT NOT NULL,
    "plantilla_id" TEXT,
    "fecha_marcado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mensaje_enviado" TEXT NOT NULL,
    "notas" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "envios_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contadores_email_key" ON "contadores"("email");

-- CreateIndex
CREATE UNIQUE INDEX "cuentas_provider_providerAccountId_key" ON "cuentas"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sesiones_sessionToken_key" ON "sesiones"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_verificacion_token_key" ON "tokens_verificacion"("token");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_verificacion_identifier_token_key" ON "tokens_verificacion"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "configuracion_contador_contador_id_key" ON "configuracion_contador"("contador_id");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_contador_id_cedula_key" ON "clientes"("contador_id", "cedula");

-- CreateIndex
CREATE UNIQUE INDEX "documentos_por_perfil_tipo_ingresos_documento_key" ON "documentos_por_perfil"("tipo_ingresos", "documento");

-- AddForeignKey
ALTER TABLE "cuentas" ADD CONSTRAINT "cuentas_contadorId_fkey" FOREIGN KEY ("contadorId") REFERENCES "contadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sesiones" ADD CONSTRAINT "sesiones_contadorId_fkey" FOREIGN KEY ("contadorId") REFERENCES "contadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuracion_contador" ADD CONSTRAINT "configuracion_contador_contador_id_fkey" FOREIGN KEY ("contador_id") REFERENCES "contadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_contador_id_fkey" FOREIGN KEY ("contador_id") REFERENCES "contadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cargas_calendario" ADD CONSTRAINT "cargas_calendario_contador_id_fkey" FOREIGN KEY ("contador_id") REFERENCES "contadores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plantillas_mensaje" ADD CONSTRAINT "plantillas_mensaje_contador_id_fkey" FOREIGN KEY ("contador_id") REFERENCES "contadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "envios_log" ADD CONSTRAINT "envios_log_contador_id_fkey" FOREIGN KEY ("contador_id") REFERENCES "contadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "envios_log" ADD CONSTRAINT "envios_log_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
