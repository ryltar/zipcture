import mozjpeg_enc, { EncodeOptions, MozJPEGModule } from '../../../../codecs/mozjpeg/enc/mozjpeg_enc';
import { initEmscriptenModule } from '../../../../utils/worker-utils';


let emscriptenModule: Promise<MozJPEGModule>;

export default async function mozjpegEncode(
  data: ImageData,
  options: EncodeOptions,
): Promise<ArrayBuffer> {
  if (emscriptenModule == null) {
    emscriptenModule = initEmscriptenModule(mozjpeg_enc);
  }

  const module = await emscriptenModule;
  const resultView = module.encode(data.data, data.width, data.height, options);
  // wasm can’t run on SharedArrayBuffers, so we hard-cast to ArrayBuffer.
  return resultView.buffer as ArrayBuffer;
}
