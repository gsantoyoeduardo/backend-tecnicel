# Instrucciones para ejecutar la migración

## Paso 1: Ejecutar la migración en Supabase

1. Abre tu proyecto en Supabase
2. Ve a **SQL Editor**
3. Copia y pega el contenido del archivo `018_add_tecnico_workflow_states.sql`
4. Ejecuta la consulta

Esto agregará los nuevos estados ('iniciada', 'reparando', 'terminada') al constraint de la tabla `solicitudes`.

## Paso 2: Verificar que la migración se ejecutó correctamente

Ejecuta esta consulta para verificar:

```sql
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'solicitudes' AND column_name = 'estado';
```

## Paso 3: Probar el flujo del técnico

1. Inicia sesión como técnico
2. Ve a la pestaña "Técnico"
3. Selecciona una orden
4. Inicia la atención (debería cambiar a estado "iniciada")
5. Cambia el estado a "reparando" o "terminada"

## Problemas resueltos

✅ Dashboard en blanco para técnicos - Ahora muestra resumen básico
✅ Error 400 al cambiar a "iniciada" - Eliminado del UI (se establece automáticamente)
✅ Error 500 al cambiar estados - Requiere ejecutar la migración SQL

## Nota importante

Si después de ejecutar la migración sigues teniendo errores 500, verifica los logs del backend en Render para más detalles.
