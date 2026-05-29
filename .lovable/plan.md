
# Plan de cambios

Recordatorio rápido: la contraseña del admin sigue siendo **`pallaresweb123`** y se entra por `/admin-pallares`.

## 1. Servicios — categorías + página de detalle
- Agregar `categories: ServiceCategory[]` al estado (id, nombre ES/EN). Editables desde admin (crear/renombrar/borrar).
- Agregar a `Service`: `categoryId`, `longDescription`, `images: string[]`, `videoUrl?`.
- Página `/servicios` se reorganiza en **secciones por categoría** con un diseño de tarjeta más rico (imagen grande arriba, badge de categoría, hover con gradiente, botón "Ver más").
- Nueva ruta `/servicios/:id` con galería de imágenes, descripción larga, video opcional embebido, precio y CTA de WhatsApp.

## 2. Citas — estilo calendario semanal
- Reemplazar el selector de fecha + grid actual por un **calendario tipo agenda**: cabeceras con los días de la semana (lun, mar, mié…) y bajo cada uno los horarios disponibles (los ocupados se ven tachados). Flecha derecha pasa a la semana siguiente.
- Mostrar el **precio del servicio seleccionado** ("Desde $X") tomado directamente de `data.services[].price` (ya es editable desde el admin).
- Mantiene la lógica actual: si un slot ya está aceptado/pendiente, queda bloqueado.

## 3. Galería — categorías + video, una sola imagen
- `GalleryItem` se simplifica: `categoryId`, `title`, `image` (una sola, ya no antes/después), `videoUrl?`, `description?`.
- Eliminar `BeforeAfterSlider` de la galería pública.
- `/galeria` se divide en **secciones por categoría** (ej: "Diseño de sonrisa en resina"), cada item con su imagen + botón play si tiene video (modal).

## 4. Testimonios públicos con aprobación
- Nueva tabla lógica: `testimonials[].status: "pending" | "approved"`.
- En `/testimonios` agregar un formulario público: nombre, rating, comentario, foto opcional (sin login). Se guarda como `pending`.
- En el admin, panel de testimonios muestra Pendientes / Aprobados con botones aceptar / rechazar / borrar.
- La página pública sólo muestra los `approved`.

## 5. Blog con videos
- `BlogPost` recibe `videoUrl?` e `images: string[]`.
- Editor del admin permite pegar link de video (YouTube/Instagram/MP4) y subir galería de imágenes.
- En la página del blog, si hay video se embebe; si hay imágenes se muestran en carrusel.

## 6. Marca de agua en el home
- Logo (tooth icon grande) como marca de agua semitransparente y centrada detrás del contenido del hero del home.

## 7. Info del doctor editable
- Nuevo objeto `doctorInfo` con: nombre, especialidad, años de experiencia, bio larga, lista de títulos/diplomas (texto), teléfono, dirección, etc.
- Panel "Doctor" en el admin para editar todo eso.
- Páginas `Home` y `Sobre mí` leen de `doctorInfo` en vez de tener texto hardcodeado.
- Encima del nombre en el hero aparecerá el chip "Especialista en estética dental · 17+ años de experiencia".

## 8. SQL / Base de datos
**No se necesita ejecutar nuevo SQL.** Todo el contenido (servicios, categorías, galería, testimonios pendientes/aprobados, blog, doctorInfo) sigue viviendo en la columna `data jsonb` de la tabla `app_data` que ya creaste. El cambio es sólo de estructura interna del JSON, y se aplica solo al recargar.

---

## Detalles técnicos (para mí)
- `AppDataContext`: nuevos tipos `ServiceCategory`, `GalleryCategory`, `DoctorInfo`; ampliar `Service`, `GalleryItem`, `Testimonial`, `BlogPost`. Default seeds con categorías de ejemplo.
- Sustituir/extender `BeforeAfterSlider` por un `VideoModal` reusable que acepta links de YouTube/Instagram/MP4.
- Rutas nuevas en `spa-app.tsx`: `/servicios/:id`.
- Form público de testimonio: `crypto.randomUUID()`, `status: "pending"`, foto opcional como dataURL (igual que las imágenes actuales).
- En el admin: nuevas pestañas **Categorías**, **Blog**, **Doctor**.

## Lo que NO se incluye en este plan
- No se conecta Supabase Auth (sigue con la contraseña fija `pallaresweb123`).
- No se migra a tablas relacionales — todo sigue en el blob JSON.
- No se cambian los colores ni la tipografía del sitio.
