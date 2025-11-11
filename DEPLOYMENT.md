# Guía de Despliegue - Plataforma de Amigurumis

Esta guía te ayudará a desplegar la aplicación en Vercel y configurarla completamente.

## Tabla de Contenidos

1. [Preparación Inicial](#preparación-inicial)
2. [Subir a GitHub](#subir-a-github)
3. [Configurar Vercel](#configurar-vercel)
4. [Configurar Base de Datos](#configurar-base-de-datos)
5. [Verificar Despliegue](#verificar-despliegue)
6. [Solución de Problemas](#solución-de-problemas)

## Preparación Inicial

### 1. Crear Repositorio en GitHub

1. Ve a [github.com](https://github.com)
2. Inicia sesión o crea una cuenta
3. Haz clic en "New" para crear un nuevo repositorio
4. Nombre: `amigurumi_requests`
5. Descripción: "Plataforma de Solicitudes de Amigurumis"
6. Selecciona "Public" o "Private"
7. No inicialices con README (ya tenemos uno)
8. Haz clic en "Create repository"

### 2. Configurar Git Localmente

```bash
cd /home/ubuntu/amigurumi_requests

# Inicializar git si no está inicializado
git init

# Agregar el repositorio remoto
git remote add origin https://github.com/tu-usuario/amigurumi_requests.git

# Cambiar a rama main si es necesario
git branch -M main

# Agregar todos los archivos
git add .

# Commit inicial
git commit -m "Initial commit: Plataforma de Solicitudes de Amigurumis"

# Subir a GitHub
git push -u origin main
```

## Subir a GitHub

### Verificar que todo está listo

```bash
# Verificar estado de git
git status

# Verificar que los archivos importantes están incluidos
git ls-files | grep -E "(package.json|drizzle|server|client)" | head -20
```

### Archivos Importantes a Incluir

Asegúrate de que estos archivos estén en el repositorio:

- `package.json` - Dependencias del proyecto
- `drizzle/schema.ts` - Esquema de base de datos
- `server/routers.ts` - API endpoints
- `server/db.ts` - Funciones de base de datos
- `client/src/` - Código del frontend
- `README.md` - Documentación
- `.gitignore` - Archivos a ignorar

### Crear .gitignore

Si no existe, crea un archivo `.gitignore`:

```
node_modules/
dist/
build/
.env
.env.local
.env.*.local
*.log
.DS_Store
.idea/
.vscode/
coverage/
.next/
out/
```

## Configurar Vercel

### 1. Conectar Vercel con GitHub

1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en "Sign Up" o "Log In"
3. Selecciona "Continue with GitHub"
4. Autoriza Vercel para acceder a tu cuenta de GitHub

### 2. Crear Nuevo Proyecto

1. En el dashboard de Vercel, haz clic en "New Project"
2. Busca tu repositorio `amigurumi_requests`
3. Haz clic en "Import"

### 3. Configurar Proyecto

En la página de configuración:

**Framework**: Selecciona "Other" (es un proyecto personalizado)

**Root Directory**: Dejar en blanco (raíz del proyecto)

**Build Command**: 
```
pnpm install && pnpm db:push && pnpm build
```

**Output Directory**: 
```
dist
```

**Install Command**:
```
pnpm install
```

### 4. Agregar Variables de Entorno

Haz clic en "Environment Variables" y agrega todas estas variables:

```
DATABASE_URL=mysql://usuario:contraseña@host:3306/amigurumi_requests
JWT_SECRET=tu_jwt_secret_generado_aleatoriamente
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_APP_ID=tu_app_id
VITE_APP_TITLE=Plataforma de Solicitudes de Amigurumis
VITE_APP_LOGO=/logo.svg
OWNER_OPEN_ID=tu_owner_open_id
OWNER_NAME=Tu Nombre
VITE_BOLD_PUBLIC_KEY=t3MlprM_OTtZumbtJcXMKXcVnlO19VFz-9MT9GVIZvY
BOLD_SECRET_KEY=JVNjvQU7QcMnW8KEsrrFlg
VITE_BOLD_PAYMENT_LINK=https://checkout.bold.co/payment/LNK_EXBI7L6EK8
NOTIFICATION_EMAIL=diegoferrangel@gmail.com
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=tu_api_key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=tu_frontend_api_key
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=tu_website_id
```

## Configurar Base de Datos

### Opción 1: PlanetScale (Recomendado)

1. Ve a [planetscale.com](https://planetscale.com)
2. Crea una cuenta o inicia sesión
3. Haz clic en "Create a new database"
4. Nombre: `amigurumi_requests`
5. Region: Selecciona la más cercana a tu ubicación
6. Haz clic en "Create database"
7. Ve a "Connect" y selecciona "Node.js"
8. Copia la conexión string
9. Actualiza `DATABASE_URL` en Vercel con esta conexión

### Opción 2: AWS RDS

1. Ve a [AWS Console](https://console.aws.amazon.com)
2. Busca "RDS"
3. Haz clic en "Create database"
4. Engine: MySQL 8.0
5. Template: Free tier
6. DB instance identifier: `amigurumi-requests`
7. Master username: `admin`
8. Master password: Genera una contraseña segura
9. Haz clic en "Create database"
10. Una vez creada, ve a "Connectivity & security"
11. Copia el endpoint
12. Crea la conexión string:
```
mysql://admin:tu_contraseña@endpoint:3306/amigurumi_requests
```
13. Actualiza `DATABASE_URL` en Vercel

### Opción 3: TiDB Cloud

1. Ve a [tidbcloud.com](https://tidbcloud.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo cluster
4. Espera a que se inicialice
5. Ve a "Connection" y copia la conexión string
6. Actualiza `DATABASE_URL` en Vercel

## Verificar Despliegue

### 1. Iniciar Despliegue

En Vercel, haz clic en "Deploy" para iniciar el despliegue.

### 2. Monitorear Progreso

- Vercel mostrará el progreso en tiempo real
- Espera a que se complete (puede tomar 5-10 minutos)
- Si hay errores, revisa los logs

### 3. Acceder a la Aplicación

Una vez completado el despliegue:

1. Vercel te dará una URL como: `https://amigurumi-requests.vercel.app`
2. Haz clic en la URL para acceder a la aplicación
3. Verifica que carga correctamente

### 4. Pruebas Básicas

1. Ve a la página de inicio
2. Haz clic en "Registrarse"
3. Completa el formulario de registro
4. Verifica que se registra correctamente
5. Intenta crear una solicitud
6. Verifica que el flujo de pago funciona

## Solución de Problemas

### Error: "Build failed"

**Causa**: Generalmente errores de compilación o dependencias faltantes

**Solución**:
```bash
# Localmente, ejecuta
pnpm install
pnpm build

# Revisa los errores y corrígelos
# Luego sube los cambios a GitHub
git add .
git commit -m "Fix build errors"
git push origin main
```

### Error: "Database connection failed"

**Causa**: `DATABASE_URL` incorrecta o base de datos no accesible

**Solución**:
1. Verifica que `DATABASE_URL` es correcta
2. Asegúrate de que la base de datos está en línea
3. Verifica que las credenciales son correctas
4. Si usas AWS RDS, verifica que el security group permite conexiones

### Error: "Payment link not working"

**Causa**: Link de Bold no configurado correctamente

**Solución**:
1. Verifica que `VITE_BOLD_PAYMENT_LINK` es correcto
2. Prueba el link directamente en el navegador
3. Verifica que Bold está activo en tu cuenta

### Aplicación lenta

**Causa**: Base de datos lenta o no optimizada

**Solución**:
1. Verifica que la base de datos está en la misma región que Vercel
2. Agrega índices a las tablas principales
3. Usa un plan de base de datos más potente

## Actualizaciones Futuras

Para actualizar la aplicación después del despliegue:

1. Haz cambios localmente
2. Prueba los cambios
3. Commit y push a GitHub:
```bash
git add .
git commit -m "Descripción de cambios"
git push origin main
```
4. Vercel automáticamente desplegará los cambios

## Dominios Personalizados

Para usar un dominio personalizado:

1. En Vercel, ve a "Settings" → "Domains"
2. Haz clic en "Add Domain"
3. Ingresa tu dominio (ej: amigurumis.com)
4. Sigue las instrucciones para configurar los registros DNS
5. Una vez configurado, la aplicación estará disponible en tu dominio

## Monitoreo y Mantenimiento

### Ver Logs

En Vercel:
1. Ve a tu proyecto
2. Haz clic en "Deployments"
3. Selecciona el despliegue más reciente
4. Haz clic en "Logs"

### Métricas

En Vercel:
1. Ve a "Analytics"
2. Revisa el tráfico, errores y rendimiento

### Actualizaciones de Seguridad

Regularmente:
1. Actualiza dependencias: `pnpm update`
2. Revisa vulnerabilidades: `pnpm audit`
3. Sube los cambios a GitHub

---

¡Tu aplicación está lista para producción! 🚀
