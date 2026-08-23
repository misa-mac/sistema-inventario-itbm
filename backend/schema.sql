-- Script DDL para Sistema de Inventario ITBM (PostgreSQL)

-- Extensión para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabla Roles y Usuarios (RBAC)
CREATE TYPE user_role AS ENUM ('Administrador', 'Técnico', 'Auditor');

CREATE TABLE usuarios (
    usuario_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol user_role NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla Ambientes (Catálogo)
CREATE TABLE ambientes (
    ambiente_id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO ambientes (nombre) VALUES 
('Sala de Cómputo 1'), ('Sala de Cómputo 2'), ('Sala de Cómputo 3'),
('Taller A'), ('Taller B'), ('Depósito'), ('Oficina');

-- 3. Tabla Activos (Hardware)
CREATE TYPE estado_activo AS ENUM ('disponible', 'en reparación', 'asignado', 'baja');

CREATE TABLE activos (
    activo_uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    estado estado_activo DEFAULT 'disponible',
    ambiente_id INT REFERENCES ambientes(ambiente_id),
    fecha_adquisicion DATE,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabla Trazabilidad (Historial inmutable)
CREATE TABLE trazabilidad (
    trazabilidad_id SERIAL PRIMARY KEY,
    activo_uuid UUID NOT NULL REFERENCES activos(activo_uuid),
    usuario_id INT NOT NULL REFERENCES usuarios(usuario_id),
    ambiente_id INT NOT NULL REFERENCES ambientes(ambiente_id),
    accion VARCHAR(100) NOT NULL,
    observaciones TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice para optimizar consultas de historial por activo
CREATE INDEX idx_trazabilidad_activo ON trazabilidad(activo_uuid);
