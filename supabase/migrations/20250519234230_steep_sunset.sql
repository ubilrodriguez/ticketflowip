/*
  # Esquema inicial para sistema de tickets

  1. Nuevas Tablas
    - `usuarios`: Almacena información de usuarios del sistema
    - `tickets`: Almacena los tickets de soporte
    - `comentarios`: Almacena comentarios en tickets
    - `notificaciones`: Almacena notificaciones del sistema
    - `archivos_adjuntos`: Almacena archivos adjuntos a tickets

  2. Seguridad
    - RLS habilitado en todas las tablas
    - Políticas específicas por rol
    - Triggers para actualizaciones automáticas

  3. Relaciones
    - Claves foráneas con eliminación en cascada donde corresponde
    - Índices para optimizar búsquedas frecuentes
*/

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  rol VARCHAR(20) NOT NULL CHECK (rol IN ('administrador', 'agente', 'cliente')),
  activo BOOLEAN DEFAULT true,
  creado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de tickets
CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero_ticket VARCHAR(20) UNIQUE NOT NULL,
  titulo VARCHAR(200) NOT NULL,
  descripcion TEXT NOT NULL,
  estado VARCHAR(20) NOT NULL CHECK (estado IN ('abierto', 'en_progreso', 'resuelto', 'cerrado')),
  prioridad VARCHAR(20) NOT NULL CHECK (prioridad IN ('Alta', 'Media', 'Baja')),
  categoria VARCHAR(50) NOT NULL,
  cliente_id uuid NOT NULL REFERENCES usuarios(id),
  asignado_id uuid REFERENCES usuarios(id),
  creado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de comentarios
CREATE TABLE IF NOT EXISTS comentarios (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id uuid NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  usuario_id uuid NOT NULL REFERENCES usuarios(id),
  mensaje TEXT NOT NULL,
  es_interno BOOLEAN DEFAULT false,
  creado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de notificaciones
CREATE TABLE IF NOT EXISTS notificaciones (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id uuid NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo VARCHAR(200) NOT NULL,
  mensaje TEXT NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  leida BOOLEAN DEFAULT false,
  creado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de archivos adjuntos
CREATE TABLE IF NOT EXISTS archivos_adjuntos (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id uuid NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  nombre_archivo VARCHAR(255) NOT NULL,
  url_archivo TEXT NOT NULL,
  tipo_archivo VARCHAR(100),
  tamaño_bytes BIGINT,
  creado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_tickets_cliente ON tickets(cliente_id);
CREATE INDEX IF NOT EXISTS idx_tickets_asignado ON tickets(asignado_id);
CREATE INDEX IF NOT EXISTS idx_tickets_estado ON tickets(estado);
CREATE INDEX IF NOT EXISTS idx_comentarios_ticket ON comentarios(ticket_id);
CREATE INDEX IF NOT EXISTS idx_notificaciones_usuario ON notificaciones(usuario_id);

-- Función para actualizar el timestamp de actualización
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.actualizado_en = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar timestamps
CREATE TRIGGER update_usuarios_timestamp
  BEFORE UPDATE ON usuarios
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_tickets_timestamp
  BEFORE UPDATE ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Función para generar número de ticket
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.numero_ticket = 'TK-' || TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDD') || '-' || 
                     LPAD(CAST((SELECT COUNT(*) + 1 FROM tickets) AS TEXT), 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para generar número de ticket automáticamente
CREATE TRIGGER set_ticket_number
  BEFORE INSERT ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION generate_ticket_number();

-- Habilitar RLS en todas las tablas
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE comentarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE archivos_adjuntos ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para usuarios
CREATE POLICY "Usuarios pueden ver su propia información" ON usuarios
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Administradores pueden ver todos los usuarios" ON usuarios
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid() AND u.rol = 'administrador'
    )
  );

-- Políticas de seguridad para tickets
CREATE POLICY "Clientes pueden ver sus propios tickets" ON tickets
  FOR SELECT USING (cliente_id = auth.uid());

CREATE POLICY "Clientes pueden crear tickets" ON tickets
  FOR INSERT WITH CHECK (cliente_id = auth.uid());

CREATE POLICY "Agentes pueden ver tickets asignados" ON tickets
  FOR SELECT USING (
    asignado_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid() AND u.rol IN ('agente', 'administrador')
    )
  );

-- Políticas de seguridad para comentarios
CREATE POLICY "Ver comentarios públicos" ON comentarios
  FOR SELECT USING (
    NOT es_interno OR
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid() AND u.rol IN ('agente', 'administrador')
    )
  );

CREATE POLICY "Crear comentarios" ON comentarios
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM tickets t
      WHERE t.id = ticket_id AND (
        t.cliente_id = auth.uid() OR
        t.asignado_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM usuarios u
          WHERE u.id = auth.uid() AND u.rol IN ('agente', 'administrador')
        )
      )
    )
  );

-- Políticas de seguridad para notificaciones
CREATE POLICY "Ver propias notificaciones" ON notificaciones
  FOR SELECT USING (usuario_id = auth.uid());

-- Políticas de seguridad para archivos adjuntos
CREATE POLICY "Ver archivos de tickets accesibles" ON archivos_adjuntos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tickets t
      WHERE t.id = ticket_id AND (
        t.cliente_id = auth.uid() OR
        t.asignado_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM usuarios u
          WHERE u.id = auth.uid() AND u.rol IN ('agente', 'administrador')
        )
      )
    )
  );