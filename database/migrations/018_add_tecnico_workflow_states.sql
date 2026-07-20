-- Agregar nuevos estados para el flujo simplificado del técnico
-- Estados: iniciada, reparando, terminada

ALTER TABLE solicitudes 
DROP CONSTRAINT IF EXISTS solicitudes_estado_check;

ALTER TABLE solicitudes 
ADD CONSTRAINT solicitudes_estado_check 
CHECK (estado IN (
  'solicitud_registrada', 'solicitud_confirmada', 'recojo_programado',
  'repartidor_en_camino', 'equipo_recogido', 'recibido_en_taller',
  'en_diagnostico', 'esperando_aprobacion', 'cotizacion_aprobada',
  'en_reparacion', 'esperando_repuesto', 'en_control_calidad',
  'listo_para_entrega', 'en_camino_al_cliente', 'entregado',
  'finalizado', 'cancelado',
  'iniciada', 'reparando', 'terminada'
));
