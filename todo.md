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


## Refinamientos Solicitados

- [x] Quitar logo de la galería de amigurumis
- [x] Mostrar logo junto al nombre en header
- [x] Agregar botón WhatsApp flotante
- [x] Cambiar título a "Algunas de Nuestras Creaciones"
- [x] Corregir nombres de vírgenes (Fátima, Guadalupe)
- [x] Agregar detalles: LED, denarios, coronas
- [x] Hacer imágenes pequeñas con modal para ampliar
- [x] Agregar botón "Solicitar" en cada imagen
- [x] Optimizar para visualización móvil


## Panel de Administración - Nuevas Características

- [x] Crear página AdminDashboard mejorada con tabla de solicitudes
- [x] Implementar vista de detalles de solicitud
- [x] Agregar sistema de cambio de estado
- [x] Crear sistema de mensajería entre admin y cliente
- [x] Agregar filtros y búsqueda de solicitudes
- [ ] Implementar exportación de datos (CSV/PDF)
- [x] Agregar estadísticas y métricas
- [ ] Crear componente de galería de imágenes de solicitudes


## Correcciones de Errores

- [x] Corregir error de hooks en AdminDashboard (mover hooks fuera de condicionales)


## Nuevas Características Solicitadas

### 1. Sistema de Notificación de Finalización
- [x] Agregar botón "Marcar como Listo" en panel de administración
- [x] Crear tabla de productos/amigurumis finalizados
- [x] Implementar notificación automática al cliente cuando se marca como listo
- [x] Agregar historial de notificaciones enviadas

### 2. Gestor de Galería Editable
- [x] Crear página de administración de galería
- [x] Agregar funcionalidad para eliminar fotos de galería
- [x] Agregar funcionalidad para editar descripciones
- [x] Agregar funcionalidad para establecer valores/precios
- [x] Integrar con base de datos para persistencia

### 3. Sistema de Códigos QR para Rastreo
- [x] Generar código QR único para cada solicitud
- [x] Crear página de rastreo con código QR
- [x] Implementar historial de estado (inicio, en progreso, finalizado)
- [x] Agregar funcionalidad para imprimir código QR
- [x] Crear vista pública de rastreo por código QR


## Correcciones Solicitadas por Usuario

- [x] Migrar productos hardcodeados de Home.tsx a la base de datos
- [x] Conectar galería de Home.tsx con productos de base de datos
- [x] Verificar que gestor de galería muestre todos los productos
- [x] Permitir edición, eliminación y creación de productos desde admin/gallery
