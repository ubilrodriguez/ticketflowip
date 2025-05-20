/*
  # Esquema inicial para sistema de tickets - Versión MySQL

  1. Nuevas Tablas
    - `usuarios`: Almacena información de usuarios del sistema
    - `tickets`: Almacena los tickets de soporte
    - `comentarios`: Almacena comentarios en tickets
    - `notificaciones`: Almacena notificaciones del sistema
    - `archivos_adjuntos`: Almacena archivos adjuntos a tickets

  2. Características adaptadas para MySQL
    - UUIDs reemplazados por AUTO_INCREMENT en IDs primarios
    - Triggers adaptados a sintaxis MySQL
    - Funciones convertidas a procedimientos MySQL
    - Eliminadas políticas RLS (no disponibles en MySQL)
*/

-- Configurar base de datos
SET sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO';
SET time_zone = '+00:00';

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(36) UNIQUE DEFAULT (UUID()),
  `nombre` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password` TEXT NOT NULL,
  `rol` ENUM('administrador', 'agente', 'cliente') NOT NULL,
  `activo` BOOLEAN DEFAULT TRUE,
  `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de tickets
CREATE TABLE IF NOT EXISTS `tickets` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(36) UNIQUE DEFAULT (UUID()),
  `numero_ticket` VARCHAR(20) UNIQUE NOT NULL,
  `titulo` VARCHAR(200) NOT NULL,
  `descripcion` TEXT NOT NULL,
  `estado` ENUM('abierto', 'en_progreso', 'resuelto', 'cerrado') NOT NULL,
  `prioridad` ENUM('Alta', 'Media', 'Baja') NOT NULL,
  `categoria` VARCHAR(50) NOT NULL,
  `cliente_id` INT NOT NULL,
  `asignado_id` INT NULL,
  `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`cliente_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`asignado_id`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de comentarios
CREATE TABLE IF NOT EXISTS `comentarios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(36) UNIQUE DEFAULT (UUID()),
  `ticket_id` INT NOT NULL,
  `usuario_id` INT NOT NULL,
  `mensaje` TEXT NOT NULL,
  `es_interno` BOOLEAN DEFAULT FALSE,
  `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de notificaciones
CREATE TABLE IF NOT EXISTS `notificaciones` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(36) UNIQUE DEFAULT (UUID()),
  `usuario_id` INT NOT NULL,
  `titulo` VARCHAR(200) NOT NULL,
  `mensaje` TEXT NOT NULL,
  `tipo` VARCHAR(50) NOT NULL,
  `leida` BOOLEAN DEFAULT FALSE,
  `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de archivos adjuntos
CREATE TABLE IF NOT EXISTS `archivos_adjuntos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(36) UNIQUE DEFAULT (UUID()),
  `ticket_id` INT NOT NULL,
  `nombre_archivo` VARCHAR(255) NOT NULL,
  `url_archivo` TEXT NOT NULL,
  `tipo_archivo` VARCHAR(100),
  `tamaño_bytes` BIGINT,
  `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Índices para mejorar el rendimiento
CREATE INDEX `idx_tickets_cliente` ON `tickets`(`cliente_id`);
CREATE INDEX `idx_tickets_asignado` ON `tickets`(`asignado_id`);
CREATE INDEX `idx_tickets_estado` ON `tickets`(`estado`);
CREATE INDEX `idx_tickets_numero` ON `tickets`(`numero_ticket`);
CREATE INDEX `idx_comentarios_ticket` ON `comentarios`(`ticket_id`);
CREATE INDEX `idx_notificaciones_usuario` ON `notificaciones`(`usuario_id`);
CREATE INDEX `idx_archivos_ticket` ON `archivos_adjuntos`(`ticket_id`);

-- Stored Procedure para generar número de ticket
DELIMITER //
CREATE PROCEDURE GenerateTicketNumber(OUT ticket_number VARCHAR(20))
BEGIN
  DECLARE ticket_count INT;
  DECLARE date_part VARCHAR(8);
  
  -- Obtener fecha actual en formato YYYYMMDD
  SET date_part = DATE_FORMAT(NOW(), '%Y%m%d');
  
  -- Contar tickets existentes para hoy
  SELECT COUNT(*) INTO ticket_count 
  FROM tickets 
  WHERE DATE(creado_en) = CURDATE();
  
  -- Generar número de ticket
  SET ticket_number = CONCAT('TK-', date_part, '-', LPAD(ticket_count + 1, 4, '0'));
END//
DELIMITER ;

-- Trigger para asignar número de ticket automáticamente
DELIMITER //
CREATE TRIGGER `set_ticket_number_before_insert`
  BEFORE INSERT ON `tickets`
  FOR EACH ROW
BEGIN
  DECLARE new_ticket_number VARCHAR(20);
  
  IF NEW.numero_ticket IS NULL OR NEW.numero_ticket = '' THEN
    CALL GenerateTicketNumber(new_ticket_number);
    SET NEW.numero_ticket = new_ticket_number;
  END IF;
END//
DELIMITER ;

-- Insertar usuario administrador por defecto (opcional)
-- ¡CAMBIAR LA CONTRASEÑA EN PRODUCCIÓN!
/*
INSERT INTO `usuarios` (`nombre`, `email`, `password`, `rol`) 
VALUES ('Administrador', 'admin@sistema.com', '$2y$10$example_hash_aqui', 'administrador');
*/