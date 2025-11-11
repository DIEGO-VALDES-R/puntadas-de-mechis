# Plataforma de Solicitudes de Amigurumis - TODO

## Características Principales

### Módulo de Registro y Autenticación
- [x] Página de registro con campos: nombre, apellido, correo, teléfono
- [x] Validación de formulario de registro
- [ ] Exportación de datos de registro a Google Sheets
- [x] Sistema de referidos/rastreo de usuarios registrados

### Módulo de Solicitud de Amigurumi
- [x] Formulario de solicitud con descripción del amigurumi
- [x] Carga de foto de referencia (archivo o cámara)
- [x] Selección de tipo de empaque (caja de madera, bolsa de papel, caja cofre, cúpula de vidrio)
- [x] Opción de pago o abono (abono obligatorio)
- [ ] Envío de SMS a números 3125912152 y 3224589653 al recibir solicitud

### Módulo de Gestión de Solicitudes
- [x] Panel para visualizar solicitudes recibidas
- [x] Opción de responder al cliente sobre su solicitud
- [x] Historial de solicitudes y comunicaciones

### Integración de Pagos
- [x] Integración con pasarela Bold (link de pago)
- [x] Validación de abono obligatorio antes de procesar solicitud
- [x] Confirmación de pago

### Notificaciones
- [ ] Envío de SMS a números especificados (pendiente: servicio SMS)
- [x] Confirmación de solicitud al cliente (por email)

### Despliegue y Publicación
- [x] Preparar código para GitHub
- [x] Configurar para despliegue en Vercel
- [x] Documentación de instalación y configuración

## Características Adicionales Implementadas
- [x] Base de datos MySQL con Drizzle ORM
- [x] API tRPC con procedimientos seguros
- [x] Autenticación con Manus OAuth
- [x] Panel de administración para gestionar solicitudes
- [x] Sistema de mensajería entre clientes y administrador
- [x] Almacenamiento de imágenes en S3
- [x] Notificaciones por email al propietario
- [x] Interfaz responsive y moderna con Tailwind CSS

## Notas
- Plataforma full-stack con React + Express + MySQL
- Autenticación con Manus OAuth
- Base de datos para almacenar solicitudes y usuarios
- Integración con Bold para pagos
- Notificaciones por email implementadas
- SMS pendiente de integración (requiere servicio externo)


## Actualizaciones de Branding - PUNTADAS DE MECHIS

- [x] Copiar imágenes de amigurumis al proyecto
- [x] Optimizar imágenes para web
- [x] Cambiar nombre de la plataforma a "PUNTADAS DE MECHIS"
- [x] Integrar logo en la página
- [x] Crear galería de amigurumis en página de inicio
- [x] Ajustar colores y estilos
- [x] Verificar que todo funciona correctamente
