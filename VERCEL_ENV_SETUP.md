# Configuración de Variables de Entorno en Vercel

Este documento lista todas las variables de entorno que debes configurar en Vercel para que la plataforma funcione correctamente.

## Variables Requeridas

### 1. Base de Datos
```
DATABASE_URL=mysql://usuario:contraseña@host:3306/nombre_base_datos
```
Ejemplo: `mysql://root:password123@db.example.com:3306/amigurumi_requests`

### 2. Autenticación y Seguridad
```
JWT_SECRET=tu_secreto_jwt_muy_seguro_aqui
```
Debe ser una cadena aleatoria fuerte de al menos 32 caracteres.

### 3. Configuración de Manus OAuth
```
VITE_APP_ID=tu_app_id_de_manus
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
```

### 4. Información de la Aplicación
```
VITE_APP_TITLE=Puntadas de Mechis
VITE_APP_LOGO=https://tu-dominio.com/logo.png
```

### 5. Información del Propietario
```
OWNER_OPEN_ID=tu_owner_open_id_de_manus
OWNER_NAME=Diego Valdés
```

### 6. APIs de Manus
```
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=tu_api_key_de_manus
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=tu_frontend_api_key_de_manus
```

### 7. Analytics (Opcional)
```
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=tu_website_id_de_analytics
```

## Cómo Configurar en Vercel

1. **Ve a tu proyecto en Vercel**: https://vercel.com/dashboard
2. **Selecciona el proyecto `puntadas-de-mechis`**
3. **Ve a "Settings" (Configuración)**
4. **En el menú lateral, selecciona "Environment Variables"**
5. **Agrega cada variable:**
   - Nombre: (ej: `DATABASE_URL`)
   - Valor: (tu valor)
   - Selecciona "Production" para que aplique en producción
   - Haz clic en "Save"

## Verificación en GitHub

Para verificar que las variables estén correctamente configuradas en GitHub:

1. **Ve a tu repositorio**: https://github.com/DIEGO-VALDES-R/puntadas-de-mechis
2. **Selecciona "Settings"** (en la pestaña superior)
3. **En el menú lateral, selecciona "Secrets and variables" → "Actions"**
4. **Aquí puedes ver las variables de entorno configuradas**

**NOTA**: Las variables de Vercel se configuran directamente en Vercel, no en GitHub. GitHub solo muestra las variables de Actions.

## Variables que ya están en el código

El proyecto ya incluye referencias a estas variables en:

- `server/_core/env.ts` - Configuración del servidor
- `vercel.json` - Configuración de Vercel
- `vite.config.ts` - Configuración de Vite

## Checklist de Configuración

- [ ] DATABASE_URL configurada
- [ ] JWT_SECRET configurada
- [ ] VITE_APP_ID configurada
- [ ] OAUTH_SERVER_URL configurada
- [ ] VITE_OAUTH_PORTAL_URL configurada
- [ ] VITE_APP_TITLE configurada
- [ ] VITE_APP_LOGO configurada
- [ ] OWNER_OPEN_ID configurada
- [ ] OWNER_NAME configurada
- [ ] BUILT_IN_FORGE_API_URL configurada
- [ ] BUILT_IN_FORGE_API_KEY configurada
- [ ] VITE_FRONTEND_FORGE_API_URL configurada
- [ ] VITE_FRONTEND_FORGE_API_KEY configurada
- [ ] VITE_ANALYTICS_ENDPOINT configurada
- [ ] VITE_ANALYTICS_WEBSITE_ID configurada

## Después de Configurar

1. Vercel redesplegará automáticamente con las nuevas variables
2. Espera a que el despliegue termine (verás un checkmark verde)
3. Abre tu URL de Vercel para probar la aplicación

## Solución de Problemas

Si ves errores después de configurar las variables:

1. **Verifica que no haya espacios en blanco** al inicio o final de los valores
2. **Revisa que la DATABASE_URL sea correcta** (usuario, contraseña, host, puerto)
3. **Asegúrate de que JWT_SECRET sea una cadena fuerte**
4. **Revisa los logs de Vercel** en la sección "Deployments"

## Contacto

Si necesitas ayuda, contacta a través de WhatsApp:
- +57 3124915127
- +57 3224589653
- +57 3204884943
