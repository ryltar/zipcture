import { resize } from '../lib/processors/resize/core';
import { Options } from '../lib/processors/resize/shared/meta';
import { EncoderState, SourceImage, defaultEncoderState, defaultProcessorState, encoderMap } from './features-meta';
import { assertSignal } from './utils';
import { convertImageDataToBlob } from './utils/canvas';
import { ImageMimeTypes } from './utils/index';
import WorkerBridge from './worker-bridge';

export class Zipicture {
  private workerBridges: WorkerBridge[] = [];
  private abortControllers: AbortController[] = [];

  constructor(maxWorkers: number = 2) {
    for (let i = 0; i < maxWorkers; i++) {
      this.workerBridges.push(new WorkerBridge());
      this.abortControllers.push(new AbortController());
    }
  }

  public async processImage(
    source: SourceImage,
    options: Options = defaultProcessorState
  ): Promise<File> {

    const availableWorker: WorkerBridge = this.workerBridges[0];

    assertSignal(availableWorker.abortController.signal);
    
    let result = await resize(source, options, availableWorker);

    return new File(
      [await convertImageDataToBlob(result, options.width, options.height, options.type)],
      `compressed.${options.type.substring(options.type.indexOf('/') + 1)}`,
      { type: options.type },
    );

  }

  public async compressImage(
    image: ImageData,
    options: EncoderState = defaultEncoderState,
  ): Promise<File> {

    const availableWorker: WorkerBridge = this.workerBridges[1];

    assertSignal(availableWorker.abortController.signal);

    const encoder = encoderMap[options.type];

    const compressedData = await encoder.encode(
      availableWorker,
      image,
      options.options
    );
  
    // This type ensures the image mimetype is consistent with our mimetype sniffer
    const type: ImageMimeTypes = encoder.meta.mimeType;
  
    return new File(
      [compressedData],
      `compressed.${encoder.meta.extension}`,
      { type },
    );
  }

}
