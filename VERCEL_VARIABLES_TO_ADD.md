# Variables de Entorno para Agregar en Vercel

Copia y pega estas variables directamente en Vercel (Settings → Environment Variables).

## Variables Configuradas

### 1. JWT_SECRET (Seguridad)
```
Nombre: JWT_SECRET
Valor: 1194a92d01d8f25f4a91d168bbc712dd
```

### 2. OAUTH_SERVER_URL (Manus OAuth)
```
Nombre: OAUTH_SERVER_URL
Valor: https://api.manus.im
```

### 3. VITE_OAUTH_PORTAL_URL (Manus OAuth Portal)
```
Nombre: VITE_OAUTH_PORTAL_URL
Valor: https://oauth.manus.im
```

### 4. VITE_APP_TITLE (Título de la Aplicación)
```
Nombre: VITE_APP_TITLE
Valor: Puntadas de Mechis
```

### 5. OWNER_NAME (Nombre del Propietario)
```
Nombre: OWNER_NAME
Valor: Diego Valdés
```

## Variables que NECESITAS Obtener de Manus

Estas variables ya están en tu proyecto Manus, solo necesitas copiarlas:

### 6. DATABASE_URL
```
Nombre: DATABASE_URL
Valor: [Obtén de tu panel de Manus - Configuración de Base de Datos]
```

### 7. VITE_APP_ID
```
Nombre: VITE_APP_ID
Valor: [Obtén de tu panel de Manus - Configuración de OAuth]
```

### 8. VITE_APP_LOGO
```
Nombre: VITE_APP_LOGO
Valor: [URL de tu logo - Obtén de tu panel de Manus]
```

### 9. OWNER_OPEN_ID
```
Nombre: OWNER_OPEN_ID
Valor: [Obtén de tu panel de Manus - Información del Propietario]
```

### 10. BUILT_IN_FORGE_API_URL
```
Nombre: BUILT_IN_FORGE_API_URL
Valor: [Obtén de tu panel de Manus - APIs Integradas]
```

### 11. BUILT_IN_FORGE_API_KEY
```
Nombre: BUILT_IN_FORGE_API_KEY
Valor: [Obtén de tu panel de Manus - APIs Integradas]
```

### 12. VITE_FRONTEND_FORGE_API_URL
```
Nombre: VITE_FRONTEND_FORGE_API_URL
Valor: [Obtén de tu panel de Manus - APIs Integradas]
```

### 13. VITE_FRONTEND_FORGE_API_KEY
```
Nombre: VITE_FRONTEND_FORGE_API_KEY
Valor: [Obtén de tu panel de Manus - APIs Integradas]
```

### 14. VITE_ANALYTICS_ENDPOINT (Opcional)
```
Nombre: VITE_ANALYTICS_ENDPOINT
Valor: [Obtén de tu panel de Manus - Analytics]
```

### 15. VITE_ANALYTICS_WEBSITE_ID (Opcional)
```
Nombre: VITE_ANALYTICS_WEBSITE_ID
Valor: [Obtén de tu panel de Manus - Analytics]
```

## Pasos para Agregar en Vercel

1. **Ve a https://vercel.com/dashboard**
2. **Selecciona tu proyecto `puntadas-de-mechis`**
3. **Ve a "Settings"** (en la pestaña superior)
4. **En el menú lateral, selecciona "Environment Variables"**
5. **Para cada variable:**
   - Haz clic en "Add New"
   - Copia el nombre de la variable (ej: JWT_SECRET)
   - Copia el valor
   - Selecciona "Production" (para que aplique en producción)
   - Haz clic en "Save"
6. **Después de agregar todas, Vercel redesplegará automáticamente**

## Dónde Encontrar las Variables en Manus

Accede a tu panel de Manus en la sección de configuración del proyecto `amigurumi_requests`:

1. **DATABASE_URL**: Sección "Database" o "Configuración de Base de Datos"
2. **VITE_APP_ID**: Sección "OAuth" o "Configuración de Aplicación"
3. **VITE_APP_LOGO**: Sección "Branding" o "Configuración Visual"
4. **OWNER_OPEN_ID**: Sección "Propietario" o "Información de Cuenta"
5. **BUILT_IN_FORGE_API_***: Sección "APIs" o "Integraciones"
6. **VITE_ANALYTICS_***: Sección "Analytics" o "Seguimiento"

## Verificación Final

Después de agregar todas las variables:

1. **Vercel mostrará un banner azul** indicando que redesplegará
2. **Espera a que el despliegue termine** (verás un checkmark verde)
3. **Abre tu URL de Vercel** para verificar que todo funciona

## Contacto

Si necesitas ayuda:
- WhatsApp: +57 3124915127
- Email: puntadasdemechis@gmail.com
