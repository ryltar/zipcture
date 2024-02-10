import { resize } from '../lib/processors/resize/core';
import { SourceImage } from './features-core';
import { EncoderState, encoderMap } from './features-meta';
import { defaultProcessorState } from './features-meta/index';
import { ImageMimeTypes, assertSignal } from './utils';
import WorkerBridge from './worker-bridge';

export class Zipcture {
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
    width: number,
    height: number
  ): Promise<ImageData> {

    const availableWorker: WorkerBridge = this.workerBridges[0];

    assertSignal(availableWorker.abortController.signal);

    let result = source.preprocessed;

    const processorState = defaultProcessorState;

    processorState.resize.height = height;
    processorState.resize.width = width;
    
    if (processorState.resize.enabled) {
      result = await resize(source, processorState.resize, availableWorker);
    }

    return result;
  }

  public async compressImage(
    image: ImageData,
    quality: number,
  ): Promise<File> {

    const encoderState: EncoderState = {
      type: 'mozJPEG',
      options: encoderMap.mozJPEG.meta.defaultOptions,
    }

    encoderState.options.quality = quality;

    const availableWorker: WorkerBridge = this.workerBridges[1];

    assertSignal(availableWorker.abortController.signal);

    const encoder = encoderMap[encoderState.type];

    const compressedData = await encoder.encode(
      availableWorker,
      image,
      encoderState.options
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
