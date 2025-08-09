# 🌐 Tutorial: Cómo Desplegar en Netlify

## ¿Qué es Netlify?

**Netlify** es una plataforma de hosting para sitios web que:
- 🌍 Hace tu website disponible en internet 24/7
- 🚀 Ofrece despliegues súper rápidos
- 🔄 Se actualiza automáticamente con cada cambio en GitHub
- 💰 Es GRATUITO para proyectos personales
- 🛠️ Excelente alternativa a Vercel

---

## 🚀 Paso a Paso: Desplegar en Netlify

### Paso 1: Crear Cuenta en Netlify

1. **Ir a Netlify**:
   - Ve a [netlify.com](https://netlify.com)

2. **Registrarse con GitHub**:
   - Haz clic en **"Sign up"**
   - Selecciona **"GitHub"**
   - Autoriza a Netlify a acceder a tu cuenta de GitHub

3. **Completar Registro**:
   - Netlify puede pedirte confirmar tu email
   - Completa el proceso de registro

### Paso 2: Conectar tu Repositorio de GitHub

1. **Dashboard de Netlify**:
   - Una vez logueado, estarás en el dashboard principal
   - Haz clic en **"New site from Git"**

2. **Elegir GitHub**:
   - Selecciona **"GitHub"** como proveedor
   - Autoriza a Netlify si te lo pide

3. **Seleccionar Repositorio**:
   - Busca tu repositorio **"delicias-de-mi-patria"**
   - Haz clic en él para seleccionarlo

### Paso 3: Configurar el Despliegue

1. **Configuración de Build**:
   - **Branch to deploy**: `main` (debe estar seleccionado)
   - **Build command**: `pnpm run build`
   - **Publish directory**: `dist`

2. **Configuraciones Avanzadas** (si no aparecen automáticamente):
   - Haz clic en **"Show advanced"**
   - **Base directory**: déjalo vacío
   - **Functions directory**: déjalo vacío

### Paso 4: Configurar Variables de Entorno

**¡MUY IMPORTANTE!** Antes de desplegar, configura estas variables:

1. **Agregar Variables de Entorno**:
   - Haz clic en **"Advanced build settings"**
   - Luego **"New variable"** para cada una:

   **Variable 1:**
   - **Key**: `VITE_STRIPE_PUBLISHABLE_KEY`
   - **Value**: `pk_test_YOUR_STRIPE_PUBLISHABLE_KEY_HERE`

   **Variable 2:**
   - **Key**: `VITE_APP_URL`
   - **Value**: `https://deliciasdempatria.netlify.app` (se generará automáticamente)

   **Variable 3 (opcional):**
   - **Key**: `VITE_SUPABASE_URL`
   - **Value**: `tu-url-de-supabase`

   **Variable 4 (opcional):**
   - **Key**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: `tu-clave-anonima-supabase`

### Paso 5: Desplegar el Sitio

1. **Iniciar Despliegue**:
   - Haz clic en **"Deploy site"**
   - Netlify comenzará el proceso de construcción

2. **Proceso de Build**:
   - Verás una pantalla con el progreso
   - El proceso toma 2-4 minutos normalmente
   - Si hay errores, aparecerán en rojo

3. **¡Sitio Desplegado!**:
   - Al completarse, verás un enlace como: `https://inspiring-name-123456.netlify.app`
   - Tu sitio estará disponible inmediatamente

### Paso 6: Personalizar el Nombre del Sitio

1. **Cambiar Nombre del Sitio**:
   - En el dashboard de tu sitio en Netlify
   - Ve a **"Site settings"** → **"Change site name"**
   - Cambia a algo como: `delicias-de-mi-patria`
   - Tu nuevo URL será: `https://delicias-de-mi-patria.netlify.app`

---

## 🌐 Configurar Dominio Personalizado (Opcional)

### Si tienes tu propio dominio:

1. **Agregar Dominio**:
   - Ve a **"Domain settings"** → **"Custom domains"**
   - Haz clic en **"Add custom domain"**
   - Escribe tu dominio (ej: `deliciasdempatria.com`)

2. **Configurar DNS**:
   - Netlify te dará instrucciones específicas
   - Opciones comunes:
     - **Nameservers de Netlify** (más fácil)
     - **DNS records** (si prefieres mantener tu DNS actual)

3. **SSL Automático**:
   - Netlify configurará SSL automáticamente
   - En 5-10 minutos tu sitio estará disponible con HTTPS

---

## 🔄 Actualizaciones Automáticas

**¡Netlify se actualiza automáticamente!** Cada vez que hagas cambios:

1. Actualizas tu código local
2. Subes a GitHub:
   ```bash
   git add .
   git commit -m "Nuevos cambios"
   git push
   ```
3. **¡Netlify detecta el cambio y redespliega automáticamente!**

---

## 📊 Panel de Control de Netlify

En tu dashboard de Netlify puedes:

- 🚀 **Deploys**: Ver historial de despliegues
- ⚙️ **Site settings**: Configuraciones generales
- 🌐 **Domain settings**: Gestión de dominios
- 📈 **Analytics**: Estadísticas de visitantes (plan pro)
- 🔧 **Build & deploy**: Configuraciones de construcción

---

## 🔧 Configuraciones Adicionales Importantes

### Actualizar Variables de Entorno después del Despliegue

1. **Ir a Variables de Entorno**:
   - **Site settings** → **Build & deploy** → **Environment variables**

2. **Editar Variables**:
   - Haz clic en **"Edit variables"**
   - Modifica las que necesites
   - Haz clic en **"Save"**

3. **Redespliegar**:
   - Ve a **"Deploys"**
   - Haz clic en **"Trigger deploy"** → **"Deploy site"**

### Configurar Redirecciones (Ya incluidas en _redirects)

El archivo `_redirects` que ya creamos manejará:
- Rutas SPA (Single Page Application)
- Redirecciones a HTTPS
- Manejo de rutas React Router

---

## ❗ Solución de Problemas

### Error: "Build failed - Command failed"
1. **Revisar Build Log**:
   - Ve a **"Deploys"**
   - Haz clic en el deploy fallido
   - Revisa el log completo

2. **Errores Comunes**:
   - **Node.js version**: Netlify usa Node 16 por defecto
   - **pnpm not found**: Agrega variable `NPM_FLAGS = --prefix=/dev/null`

### Error: "Site loads but Stripe doesn't work"
- Verifica que `VITE_STRIPE_PUBLISHABLE_KEY` esté configurada correctamente
- Debe empezar con `pk_test_` para desarrollo o `pk_live_` para producción

### Error: "Page not found (404)" en rutas internas
- Verifica que el archivo `_redirects` esté en la carpeta `public/`
- Debe contener: `/*    /index.html   200`

### Error: "Build command failed"
Agrega estas variables de entorno:
```
NODE_VERSION = 18
NPM_FLAGS = --prefix=/dev/null
```

---

## 🆚 Netlify vs Vercel - Comparación Rápida

| Característica | Netlify | Vercel |
|---|---|---|
| **Facilidad de uso** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Velocidad de build** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Plan gratuito** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Dominio personalizado** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Funciones serverless** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

**Recomendación**: Ambos son excelentes. Vercel es mejor para React/Next.js, Netlify es más versátil.

---

## 💰 Costos de Netlify

**Plan Gratuito incluye:**
- ✅ 100GB de ancho de banda
- ✅ 300 minutos de build por mes
- ✅ Despliegues ilimitados
- ✅ SSL automático
- ✅ Dominios personalizados
- ✅ Perfecto para tu tienda online

---

## ✅ Lista de Verificación Final

Después del despliegue, verifica:

- ✅ Tu sitio carga en la URL de Netlify
- ✅ Todas las páginas funcionan
- ✅ Los productos se muestran correctamente
- ✅ El carrito de compras funciona
- ✅ El panel de admin (`/admin`) es accesible
- ✅ Stripe está funcionando (usa claves de prueba para testing)
- ✅ Las rutas internas funcionan (no dan 404)

---

## 🔍 URLs Importantes

Después del despliegue tendrás:

- **Tu tienda**: `https://delicias-de-mi-patria.netlify.app`
- **Panel admin**: `https://delicias-de-mi-patria.netlify.app/admin`
- **Dashboard Netlify**: [app.netlify.com](https://app.netlify.com)
- **Configuraciones**: `https://app.netlify.com/sites/delicias-de-mi-patria/settings`

---

## 🎉 ¡Felicitaciones!

**¡Tu tienda "Delicias de mi Patria" ya está online con Netlify!**

Beneficios que ahora tienes:
- 🌍 **Disponible mundialmente** 24/7
- 🚀 **Súper rápido** con CDN global
- 🔒 **Seguro** con HTTPS automático
- 🔄 **Actualizaciones automáticas** desde GitHub
- 💳 **Pagos seguros** funcionando con Stripe
- 📱 **Responsive** en todos los dispositivos

**¡Ya puedes empezar a recibir pedidos!** 🎊

¿Necesitas ayuda con algún paso específico? ¡Pregúntame!