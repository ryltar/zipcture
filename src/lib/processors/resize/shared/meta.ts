import { ImageMimeTypes } from "../../../../core/utils";

type BrowserResizeMethods =
  | 'browser-pixelated'
  | 'browser-low'
  | 'browser-medium'
  | 'browser-high';

type WorkerResizeMethods =
  | 'triangle'
  | 'catrom'
  | 'mitchell'
  | 'lanczos3'
  | 'hqx';

type VectorResizeMethods = 
  | 'vector';

export const browserResizeMethods: BrowserResizeMethods[] = [
  'browser-pixelated',
  'browser-low',
  'browser-medium',
  'browser-high'
]

export const workerResizeMethods: WorkerResizeMethods[] = [
  'triangle',
  'catrom',
  'mitchell',
  'lanczos3',
  'hqx',
];

export const VectorResizeMethods: VectorResizeMethods[] = [
  'vector'
]

export type Options =
  | BrowserResizeOptions
  | WorkerResizeOptions
  | VectorResizeOptions;

export interface ResizeOptionsCommon {
  width: number;
  height: number;
  fitMethod: 'stretch' | 'contain';
  type: ImageMimeTypes;
}

export interface BrowserResizeOptions extends ResizeOptionsCommon {
  method: BrowserResizeMethods;
}

export interface WorkerResizeOptions extends ResizeOptionsCommon {
  method: WorkerResizeMethods;
  premultiply: boolean;
  linearRGB: boolean;
}

export interface VectorResizeOptions extends ResizeOptionsCommon {
  method: VectorResizeMethods;
}

export const defaultOptions: Options = {
  // Width and height will always default to the image size.
  // This is set elsewhere.
  width: 1,
  height: 1,
  // This will be set to 'vector' if the input is SVG.
  method: 'lanczos3',
  fitMethod: 'stretch',
  premultiply: true,
  linearRGB: true,
};
