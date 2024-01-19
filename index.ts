import { EncodeOptions } from "./src/codecs/mozjpeg/enc/mozjpeg_enc";
import encode from "./src/lib/encoders/mozJPEG/worker/mozjpegEncode";

export async function e(data: ImageData, options: EncodeOptions) {
    encode(data, options);
}
