/**
 * Reduce y comprime una imagen antes de guardarla.
 * Una foto de celular de 3-5 MB queda en ~100-250 KB, así no se llena
 * el localStorage (límite ~5 MB) ni se sobrecarga la base de datos.
 */
export async function compressImage(
  file: File,
  maxSize = 1280,
  quality = 0.82,
): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("El archivo no es una imagen.");

  // SVG: no se puede rasterizar sin perder calidad; solo si es pequeño.
  if (file.type === "image/svg+xml") {
    if (file.size > 200 * 1024) throw new Error("El SVG es demasiado pesado (máx. 200 KB).");
    return readAsDataURL(file);
  }

  const dataUrl = await readAsDataURL(file);
  const img = await loadImage(dataUrl);

  let { width, height } = img;
  const scale = Math.min(1, maxSize / Math.max(width, height));
  width = Math.round(width * scale);
  height = Math.round(height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo procesar la imagen.");
  ctx.drawImage(img, 0, 0, width, height);

  // WebP si el navegador lo soporta; si no, JPEG.
  let out = canvas.toDataURL("image/webp", quality);
  if (!out.startsWith("data:image/webp")) out = canvas.toDataURL("image/jpeg", quality);
  return out;
}

function readAsDataURL(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(new Error("No se pudo leer el archivo."));
    r.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Imagen no válida."));
    img.src = src;
  });
}
