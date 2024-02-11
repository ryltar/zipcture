import { ImageMimeTypes } from "..";

/** Replace the contents of a canvas with the given data */
export function drawDataToCanvas(canvas: OffscreenCanvas, data: ImageData) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw Error('Canvas not initialized');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(data, 0, 0);
}

/** Replace the contents of a canvas with the given data */
export async function convertImageDataToBlob(data: ImageData, width: number, height: number, type: ImageMimeTypes): Promise<Blob> {
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.putImageData(data, 0, 0);      
  return await canvas.convertToBlob()
}

interface DrawableToImageDataOptions {
  width?: number;
  height?: number;
  sx?: number;
  sy?: number;
  sw?: number;
  sh?: number;
}

export function drawableToImageData(
  drawable: ImageBitmap | HTMLImageElement,
  opts: DrawableToImageDataOptions = {},
): ImageData {
  const {
    width = drawable.width,
    height = drawable.height,
    sx = 0,
    sy = 0,
    sw = drawable.width,
    sh = drawable.height,
  } = opts;

  // Make canvas same size as image
  const canvas = new OffscreenCanvas(width, height);
  
  // Draw image onto canvas
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not create canvas context');
  ctx.drawImage(drawable, sx, sy, sw, sh, 0, 0, width, height);
  return ctx.getImageData(0, 0, width, height);
}

export type BuiltinResizeMethod = 'pixelated' | 'low' | 'medium' | 'high';

export function builtinResize(
  data: ImageData,
  sx: number,
  sy: number,
  sw: number,
  sh: number,
  dw: number,
  dh: number,
  method: BuiltinResizeMethod,
): ImageData {
  const canvasSource = new OffscreenCanvas(data.width, data.height);
  drawDataToCanvas(canvasSource, data);

  const canvasDest = new OffscreenCanvas(dw, dh);
  const ctx = canvasDest.getContext('2d');

  if (!ctx) throw new Error('Could not create canvas context');

  if (method === 'pixelated') {
    ctx.imageSmoothingEnabled = false;
  } else {
    ctx.imageSmoothingQuality = method;
  }

  ctx.drawImage(canvasSource, sx, sy, sw, sh, 0, 0, dw, dh);
  return ctx.getImageData(0, 0, dw, dh);
}

