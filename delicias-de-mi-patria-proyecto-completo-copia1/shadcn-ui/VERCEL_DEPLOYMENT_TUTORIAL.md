# 🚀 Tutorial: Cómo Desplegar en Vercel

## Variables de Entorno Requeridas

En el dashboard de Vercel, configura las siguientes variables:

### Variables Requeridas:
   - **Name**: `VITE_STRIPE_PUBLISHABLE_KEY`
   - **Value**: `pk_test_YOUR_STRIPE_PUBLISHABLE_KEY_HERE`

## Configuración del Proyecto

Crea un archivo `.env` en la raíz del proyecto:

```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_STRIPE_PUBLISHABLE_KEY_HERE
```

## Verificación

- Verifica que `VITE_STRIPE_PUBLISHABLE_KEY` esté correctamente configurada
- Usa claves de prueba para desarrollo y claves live para producción