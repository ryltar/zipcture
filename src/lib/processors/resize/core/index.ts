import { SourceImage } from '../../../../core/features-meta';
import { BuiltinResizeMethod, builtinResize, drawableToImageData } from '../../../../core/utils/canvas';
import WorkerBridge from '../../../../core/worker-bridge';
import {
  BrowserResizeOptions,
  Options as ResizeOptions,
  VectorResizeOptions,
  WorkerResizeOptions,
  workerResizeMethods,
} from '../shared/meta';
import { getContainOffsets } from '../shared/util';

/**
 * Return whether a set of options are worker resize options.
 *
 * @param opts
 */
function isWorkerOptions(opts: ResizeOptions): opts is WorkerResizeOptions {
  return (workerResizeMethods as string[]).includes(opts.method);
}

function browserResize(data: ImageData, opts: BrowserResizeOptions): ImageData {
  let sx = 0;
  let sy = 0;
  let sw = data.width;
  let sh = data.height;

  if (opts.fitMethod === 'contain') {
    ({ sx, sy, sw, sh } = getContainOffsets(sw, sh, opts.width, opts.height));
  }

  return builtinResize(
    data,
    sx,
    sy,
    sw,
    sh,
    opts.width,
    opts.height,
    opts.method.slice('browser-'.length) as BuiltinResizeMethod,
  );
}

function vectorResize(
  data: HTMLImageElement,
  opts: VectorResizeOptions,
): ImageData {
  let sx = 0;
  let sy = 0;
  let sw = data.width;
  let sh = data.height;

  if (opts.fitMethod === 'contain') {
    ({ sx, sy, sw, sh } = getContainOffsets(sw, sh, opts.width, opts.height));
  }

  return drawableToImageData(data, {
    sx,
    sy,
    sw,
    sh,
    width: opts.width,
    height: opts.height,
  });
}

export async function resize(
  source: SourceImage,
  options: ResizeOptions,
  workerBridge: WorkerBridge,
) {
  if (options.method === 'vector') {
    if (!source.htmlImageElement) throw Error('No vector image available');
    return vectorResize(source.htmlImageElement, options);
  }
  if (isWorkerOptions(options)) {
    return workerBridge.resize(source.imageData, options);
  }
  return browserResize(source.imageData, options);
}



