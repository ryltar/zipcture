import * as mozJPEGEncoderEntry from '../../lib/encoders/mozJPEG/core';
import * as mozJPEGEncoderMeta from '../../lib/encoders/mozJPEG/shared/meta';
import { BrowserResizeOptions, Options, VectorResizeOptions, WorkerResizeOptions, defaultProcessOptions } from './../../lib/processors/resize/shared/meta';


export type EncoderState = { type: "mozJPEG", options: mozJPEGEncoderMeta.EncodeOptions };
export type EncoderOptions = mozJPEGEncoderMeta.EncodeOptions;
export const encoderMap = { mozJPEG: { meta: mozJPEGEncoderMeta, ...mozJPEGEncoderEntry }};

export const defaultProcessorState: Options = {
    ...defaultProcessOptions
}

export const defaultEncoderState: EncoderState = {
    type: 'mozJPEG',
    options: mozJPEGEncoderMeta.defaultEncoderOptions
}

export interface SourceImage {
    imageData?: ImageData;
    htmlImageElement?: HTMLImageElement;
}

export { BrowserResizeOptions, Options, VectorResizeOptions, WorkerResizeOptions };

