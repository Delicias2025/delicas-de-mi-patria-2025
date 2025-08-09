# 📚 Tutorial: Cómo Subir tu Proyecto a GitHub

## ⚡ ¿No sabes cómo abrir la terminal?

**¡No te preocupes!** Lee primero el archivo `COMO_ABRIR_TERMINAL.md` donde explico:
- 💻 Cómo abrir terminal en Windows/Mac/Linux
- 🌟 **Alternativas SIN terminal** (GitHub Desktop, VS Code, Web)
- 🔒 Información sobre privacidad de tu código

**¡Hay opciones mucho más fáciles que la terminal!**

---

## ¿Qué es GitHub y por qué lo necesitas?

**GitHub** es como una "nube" especial para desarrolladores donde puedes:
- 🔄 Guardar tu código de forma segura
- 📝 Llevar un historial de todos los cambios
- 🌐 Conectar tu proyecto con servicios de hosting (Vercel/Netlify)
- 🤝 Colaborar con otros desarrolladores

**¿Por qué necesitas GitHub para publicar tu web?**
- Vercel y Netlify se conectan directamente a GitHub
- Cada vez que actualices tu código, tu página web se actualizará automáticamente
- Es GRATUITO para proyectos públicos

---

## 🚀 Paso a Paso: Subir tu Proyecto a GitHub

### Paso 1: Crear un Nuevo Repositorio en GitHub

1. **Ir a GitHub**:
   - Ve a [github.com](https://github.com)
   - Inicia sesión con tu cuenta existente

2. **Crear Repositorio**:
   - Haz clic en el botón verde **"New"** (o el ícono **"+"** arriba a la derecha)
   - Selecciona **"New repository"**

3. **Configurar el Repositorio**:
   - **Repository name**: `delicias-de-mi-patria`
   - **Description**: `Tienda online de productos tradicionales mexicanos`
   - **Public** ✅ (selecciona esta opción - es necesario para el plan gratuito)
   - **NO marques**: "Add a README file"
   - **NO marques**: "Add .gitignore" 
   - **NO marques**: "Choose a license"

4. **Crear**:
   - Haz clic en **"Create repository"**

### Paso 2: Preparar tu Proyecto Local

Abre la terminal en tu computadora y ejecuta estos comandos uno por uno:

```bash
# Navegar a tu proyecto
cd /data/chats/b8ad9394ef3a432c807373a42d29127b/workspace/shadcn-ui

# Inicializar Git (si no está iniciado)
git init

# Agregar todos los archivos
git add .

# Crear el primer commit
git commit -m "Primer commit - Delicias de mi Patria E-commerce"
```

### Paso 3: Conectar tu Proyecto con GitHub

**¡IMPORTANTE!** Reemplaza `TU-USUARIO` con tu nombre de usuario real de GitHub:

```bash
# Conectar con tu repositorio de GitHub
git remote add origin https://github.com/TU-USUARIO/delicias-de-mi-patria.git

# Cambiar a la rama main
git branch -M main

# Subir tu código a GitHub
git push -u origin main
```

### Paso 4: Verificar que se Subió Correctamente

1. **Refrescar GitHub**:
   - Ve a tu repositorio en GitHub
   - Actualiza la página (F5)
   - Deberías ver todos tus archivos del proyecto

2. **Verificar archivos importantes**:
   - ✅ `package.json`
   - ✅ `src/` folder
   - ✅ `public/` folder
   - ✅ `vercel.json`
   - ✅ `netlify.toml`

---

## 🔄 Comandos para Futuras Actualizaciones

Cuando hagas cambios a tu proyecto y quieras actualizarlos:

```bash
# Agregar cambios
git add .

# Crear commit con descripción
git commit -m "Descripción de los cambios realizados"

# Subir cambios
git push
```

---

## ❗ Solución de Problemas Comunes

### Error: "Git command not found"
- **Windows**: Instala Git desde [git-scm.com](https://git-scm.com)
- **Mac**: Instala Xcode Command Line Tools: `xcode-select --install`

### Error: "Permission denied"
```bash
# Configurar tu identidad en Git
git config --global user.name "Tu Nombre"
git config --global user.email "tu-email@ejemplo.com"
```

### Error: "Repository already exists"
- El repositorio ya fue creado, solo usa el comando `git push`

### Error: "Failed to push"
```bash
# Forzar la subida (solo la primera vez)
git push --set-upstream origin main --force
```

---

## ✅ Verificación Final

Después de completar estos pasos, deberías tener:

- ✅ Tu cuenta de GitHub configurada
- ✅ Un repositorio llamado `delicias-de-mi-patria`
- ✅ Todo tu código subido y visible en GitHub
- ✅ URL del repositorio: `https://github.com/TU-USUARIO/delicias-de-mi-patria`

---

## 🎯 Próximo Paso

Una vez que tu código esté en GitHub, podrás:

1. **Desplegar en Vercel** (sigue el tutorial `VERCEL_DEPLOYMENT_TUTORIAL.md`)
2. **Desplegar en Netlify** (sigue el tutorial `NETLIFY_DEPLOYMENT_TUTORIAL.md`)

**¡Tu proyecto ya está listo para ser desplegado! 🚀**