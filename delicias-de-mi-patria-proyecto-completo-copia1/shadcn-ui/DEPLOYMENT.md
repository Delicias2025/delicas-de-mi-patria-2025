# Guía de Despliegue en Vercel

## Configuración de Variables de Entorno

En el dashboard de Vercel, configura las siguientes variables:

### Variables Requeridas:
   - `VITE_STRIPE_PUBLISHABLE_KEY`: `pk_test_YOUR_STRIPE_PUBLISHABLE_KEY_HERE`

## Archivo .env

Crea un archivo `.env` en la raíz del proyecto:

```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_STRIPE_PUBLISHABLE_KEY_HERE
```

## Verificación

- Verifica que `VITE_STRIPE_PUBLISHABLE_KEY` esté configurada correctamente
- Asegúrate de usar las claves de prueba para desarrollo