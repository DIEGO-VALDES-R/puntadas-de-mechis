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


## Funcionalidad de Carga de Imágenes

- [x] Crear componente ImageUpload con vista previa
- [x] Integrar carga de imágenes en GalleryManager
- [x] Agregar procedimiento tRPC para subir imágenes a S3
- [x] Permitir edición de productos con cambio de foto
- [x] Validar tipos y tamaños de archivo


## Solicitudes Nuevas - Fase 2 de Desarrollo

### 1. Flujo de Registro Integrado
- [x] Modificar formulario de solicitud para incluir registro automático
- [x] Si cliente no está registrado, mostrar formulario de registro primero
- [x] Guardar datos de cliente antes de procesar solicitud
- [x] Redirigir a formulario de amigurumi después de registro

### 2. Sistema de Referidos y Descuentos
- [x] Crear tabla de referidos en base de datos
- [x] Crear tabla de descuentos/cupones
- [x] Implementar lógica de descuento para clientes recurrentes
- [x] Crear sistema de asignación de descuentos a referidos
- [x] Panel admin para gestionar descuentos por referido
- [x] Mostrar descuento aplicado en checkout

### 3. Módulo de Inventario
- [x] Crear tabla de inventario en base de datos
- [x] Crear página de inventario en panel admin
- [x] Agregar funcionalidad para registrar compras pendientes
- [x] Agregar funcionalidad para registrar compras hechas
- [x] Mostrar cantidad, tipo de producto, número de referencia
- [x] Mostrar valores de compra
- [x] Generar reportes de inventario

### 4. Módulo de Contabilidad
- [x] Crear tabla de transacciones financieras
- [x] Crear página de contabilidad en panel admin
- [x] Mostrar inversión total vs ingresos totales
- [x] Calcular ganancias (ingresos - gastos de materiales)
- [x] Mostrar gastos fijos (materiales de compra)
- [x] Generar reportes de ganancias
- [x] Gráficos de ingresos vs gastos

### 5. Exportación a Google Sheets
- [x] Configurar credenciales de Google Sheets API
- [x] Crear procedimiento tRPC para exportar clientes
- [x] Crear procedimiento tRPC para exportar solicitudes
- [x] Crear procedimiento tRPC para exportar transacciones
- [x] Botones de exportación en panel admin

### 6. Autenticación del Panel Admin
- [x] Crear tabla de credenciales admin en base de datos
- [x] Implementar login con contraseña para panel admin
- [x] Proteger rutas del panel admin
- [x] Crear página de login para admin
- [x] Implementar sesión segura

### 7. Panel de Cliente Registrado
- [x] Crear página de login para clientes
- [x] Mostrar historial de compras del cliente
- [x] Mostrar referidos que han comprado
- [x] Permitir hacer nuevas solicitudes desde panel
- [x] Mostrar descuentos disponibles
- [x] Mostrar estado de solicitudes

### 8. Módulo de Comunidad
- [x] Crear tabla de patrones en base de datos
- [x] Crear tabla de clases de tejido
- [x] Crear tabla de retos
- [x] Crear página de tienda de patrones
- [x] Crear página de clases de tejido
- [x] Crear página de retos
- [x] Implementar sistema de compra de patrones/clases
- [x] Crear comunidad/foro de tejedoras


## Nuevas Características - Fase 2

### 1. Sistema de Promociones por Porcentaje
- [x] Crear tabla de promociones en base de datos
- [x] Agregar procedimientos tRPC para crear/actualizar/eliminar promociones
- [x] Mostrar descuentos en galería
- [x] Aplicar descuentos al precio

### 2. Categorización de Galería
- [x] Crear tabla de categorías en base de datos
- [x] Agregar campos de categoría a galleryItems
- [x] Crear procedimientos tRPC para categorías
- [x] Página de galería con filtrado por categorías

### 3. Fotos Destacadas
- [x] Agregar campos isHighlighted y highlightOrder a galleryItems
- [x] Crear sección de fotos destacadas en galería
- [x] Mostrar 3-4 fotos destacadas en la parte superior

### 4. Integración de WhatsApp
- [x] Crear archivo de constantes de WhatsApp
- [x] Agregar 3 números de contacto (3124915127, 3224589653, 3204884943)
- [x] Crear funciones para generar links de WhatsApp
- [x] Mostrar botones de WhatsApp en galería

### 5. Router de Galería Mejorado
- [x] Agregar procedimientos para categorías
- [x] Agregar procedimientos para promociones
- [x] Agregar procedimientos para actualizar items con categoría/destacado
- [x] Integrar router en appRouter

### 6. Página de Galería Showcase
- [x] Crear página GalleryShowcase con categorías
- [x] Mostrar fotos destacadas en sección especial
- [x] Filtrado por categorías con tabs
- [x] Mostrar descuentos en tarjetas
- [x] Botones de WhatsApp en sección de contacto
