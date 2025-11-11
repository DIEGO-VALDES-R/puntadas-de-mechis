# Plataforma de Solicitudes de Amigurumis

Una aplicación web completa para recibir y gestionar solicitudes de amigurumis personalizados, con integración de pagos a través de Bold y notificaciones por email.

## Características

- **Registro de Usuarios**: Clientes pueden registrarse con nombre, apellido, correo y teléfono
- **Solicitud de Amigurumis**: Formulario completo con descripción, foto de referencia y opciones de empaque
- **Opciones de Empaque**: Caja de Madera, Bolsa de Papel, Caja Cofre, Cúpula de Vidrio
- **Pagos Seguros**: Integración con Bold para procesar abonos obligatorios
- **Carga de Imágenes**: Soporte para subir fotos de referencia desde archivo o cámara
- **Panel de Administración**: Gestión de solicitudes, actualización de estado y comunicación con clientes
- **Notificaciones**: Alertas por email cuando se reciben nuevas solicitudes
- **Historial de Solicitudes**: Los clientes pueden ver el estado de sus solicitudes

## Stack Tecnológico

- **Frontend**: React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, tRPC, Node.js
- **Base de Datos**: MySQL/TiDB con Drizzle ORM
- **Autenticación**: Manus OAuth
- **Pagos**: Bold Payment Gateway
- **Almacenamiento**: S3 (para imágenes)
- **Despliegue**: Vercel

## Instalación Local

### Requisitos Previos

- Node.js 18+ y npm/pnpm
- MySQL 8.0+ o TiDB
- Git

### Pasos de Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/tu-usuario/amigurumi_requests.git
cd amigurumi_requests
```

2. **Instalar dependencias**

```bash
pnpm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# Database
DATABASE_URL=mysql://usuario:contraseña@localhost:3306/amigurumi_requests

# Authentication
JWT_SECRET=tu_jwt_secret_aqui
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# Application
VITE_APP_ID=tu_app_id
VITE_APP_TITLE=Plataforma de Solicitudes de Amigurumis
VITE_APP_LOGO=/logo.svg

# Owner Information
OWNER_OPEN_ID=tu_owner_open_id
OWNER_NAME=Tu Nombre

# Bold Payment Gateway
VITE_BOLD_PUBLIC_KEY=tu_llave_publica_bold
BOLD_SECRET_KEY=tu_llave_secreta_bold
VITE_BOLD_PAYMENT_LINK=https://checkout.bold.co/payment/LNK_EXBI7L6EK8

# Email Configuration
NOTIFICATION_EMAIL=tu_correo@ejemplo.com

# Storage (Manus Built-in)
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=tu_api_key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=tu_frontend_api_key

# Analytics (Opcional)
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=tu_website_id
```

4. **Crear la base de datos**

```bash
# La base de datos se creará automáticamente con la migración
pnpm db:push
```

5. **Iniciar el servidor de desarrollo**

```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`

## Despliegue en Vercel

### Pasos para Desplegar

1. **Subir a GitHub**

```bash
git add .
git commit -m "Initial commit: Amigurumi requests platform"
git push origin main
```

2. **Conectar con Vercel**

- Ve a [vercel.com](https://vercel.com)
- Inicia sesión o crea una cuenta
- Haz clic en "New Project"
- Selecciona tu repositorio de GitHub
- Configura las variables de entorno en Vercel:
  - Copia todas las variables del archivo `.env.local`
  - Pégalas en la sección "Environment Variables" de Vercel

3. **Configurar la Base de Datos**

- Usa una base de datos MySQL en la nube (ej: PlanetScale, AWS RDS, etc.)
- Actualiza `DATABASE_URL` en las variables de entorno de Vercel

4. **Deploy**

- Haz clic en "Deploy"
- Vercel compilará y desplegará automáticamente

## Estructura del Proyecto

```
amigurumi_requests/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas de la aplicación
│   │   ├── components/    # Componentes reutilizables
│   │   ├── lib/           # Utilidades y librerías
│   │   ├── App.tsx        # Rutas principales
│   │   └── main.tsx       # Punto de entrada
│   └── public/            # Archivos estáticos
├── server/                # Backend Express + tRPC
│   ├── routers.ts         # Procedimientos tRPC
│   ├── db.ts              # Funciones de base de datos
│   ├── notifications.ts   # Sistema de notificaciones
│   └── bold.ts            # Integración con Bold
├── drizzle/               # Esquema y migraciones
│   └── schema.ts          # Definición de tablas
└── shared/                # Código compartido

```

## Rutas de la Aplicación

| Ruta | Descripción |
|------|-------------|
| `/` | Página de inicio |
| `/register` | Registro de nuevos clientes |
| `/request` | Crear solicitud de amigurumi |
| `/payment` | Procesar pago |
| `/payment-success` | Confirmación de pago |
| `/my-requests` | Ver mis solicitudes |
| `/admin` | Panel de administración |

## API Endpoints (tRPC)

### Clientes
- `customer.register` - Registrar nuevo cliente
- `customer.getByEmail` - Obtener cliente por email
- `customer.getById` - Obtener cliente por ID

### Solicitudes
- `request.create` - Crear nueva solicitud
- `request.getById` - Obtener solicitud por ID
- `request.getByCustomerId` - Obtener solicitudes de un cliente
- `request.getAll` - Obtener todas las solicitudes (admin)
- `request.update` - Actualizar solicitud (admin)

### Pagos
- `payment.create` - Crear registro de pago
- `payment.updateFromWebhook` - Actualizar pago desde webhook de Bold

### Comunicaciones
- `communication.create` - Enviar mensaje
- `communication.getByRequestId` - Obtener mensajes de una solicitud

## Configuración de Bold

1. Accede a tu cuenta de Bold
2. Ve a "Llaves de Integración"
3. Copia tu llave pública y secreta
4. Configura el link de pago personalizado
5. Actualiza las variables de entorno con estas llaves

## Notificaciones por Email

Las notificaciones se envían automáticamente a `NOTIFICATION_EMAIL` cuando:
- Se recibe una nueva solicitud
- Se realiza un pago

## SMS (Futuro)

Los números para SMS están configurados en el código:
- 3125912152
- 3224589653

Cuando integres un servicio de SMS (Twilio, AWS SNS, etc.), actualiza `server/notifications.ts`

## Contribuir

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la licencia MIT.

## Soporte

Para reportar problemas o sugerencias, abre un issue en GitHub.

## Autor

Diego Ferrangel - [diegoferrangel@gmail.com](mailto:diegoferrangel@gmail.com)

---

**Última actualización**: Noviembre 2024
