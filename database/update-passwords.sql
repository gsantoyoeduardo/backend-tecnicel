-- ============================================
-- ACTUALIZAR CONTRASEÑAS - Ejecutar en Supabase SQL Editor
-- ============================================

-- Admin (contraseña: admin123)
UPDATE usuarios 
SET password_hash = '$2a$10$mxyOn5jVx5jGb7h8Si0Dp.QZBiZ6MeLSidvW6A2GPiZq0Ny44asrG'
WHERE email = 'admin@tecnicel.com';

-- Recepcionista (contraseña: recepcion123)
UPDATE usuarios 
SET password_hash = '$2a$10$1DxLBBknbsO9Q08PUz8etuNMoh..UsZ6UvHC44QSXrieGaWwYiJsK'
WHERE email = 'recepcion@tecnicel.com';

-- Técnico (contraseña: tecnico123)
UPDATE usuarios 
SET password_hash = '$2a$10$1K2NqQMQp4KLQ2GaXgkliuRRNfz6J5gQbTQ6CaVtOKqVTN9r5R9QS'
WHERE email = 'tecnico@tecnicel.com';

-- Técnico 2 (contraseña: tecnico123)
UPDATE usuarios 
SET password_hash = '$2a$10$1K2NqQMQp4KLQ2GaXgkliuRRNfz6J5gQbTQ6CaVtOKqVTN9r5R9QS'
WHERE email = 'tecnico2@tecnicel.com';
