import { expose } from 'comlink';
import { resize } from '../../codecs/hqx/pkg/squooshhqx';
import mozjpegEncode from '../../lib/encoders/mozJPEG/worker/mozjpegEncode';

const exports = {
  mozjpegEncode(
    ...args: Parameters<typeof mozjpegEncode>
  ): ReturnType<typeof mozjpegEncode> {
    return mozjpegEncode(...args);
  },
  resize(
    ...args: Parameters<typeof resize>
  ): ReturnType<typeof resize> {
    return resize(...args);
  },
};

export type ProcessorWorkerApi = typeof exports;
// 'as any' to work around the way our client code has insight into worker code
expose(exports, self as any);