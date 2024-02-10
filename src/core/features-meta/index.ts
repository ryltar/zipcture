import * as mozJPEGEncoderEntry from '../../lib/encoders/mozJPEG/core';
import * as mozJPEGEncoderMeta from '../../lib/encoders/mozJPEG/shared/meta';
import * as resizeProcessorMeta from '../../lib/processors/resize/shared/meta';

export type EncoderState = { type: "mozJPEG", options: mozJPEGEncoderMeta.EncodeOptions };
export type EncoderOptions = mozJPEGEncoderMeta.EncodeOptions;
export const encoderMap = { mozJPEG: { meta: mozJPEGEncoderMeta, ...mozJPEGEncoderEntry }};

export const defaultProcessorState: ProcessorState = {
    resize: { enabled: true, ...resizeProcessorMeta.defaultOptions }
  }

interface Enableable { enabled: boolean; }
export interface ProcessorState { resize: Enableable & resizeProcessorMeta.Options }
