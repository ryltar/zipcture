import WorkerBridge from '../../../../core/worker-bridge';
import { EncodeOptions } from '../shared/meta';

export function encode(
  workerBridge: WorkerBridge,
  imageData: ImageData,
  options: EncodeOptions,
) {
  return workerBridge.mozjpegEncode(imageData, options);
}


