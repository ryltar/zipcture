import { Remote, wrap } from "comlink";
import { ProcessorWorkerApi } from "../features-worker/features.worker";
import { abortable } from "../utils";
import { BridgeMethods, methodNames } from './meta';

/** How long the worker should be idle before terminating. */
const workerTimeout = 10_000;

interface WorkerBridge extends BridgeMethods {}

class WorkerBridge {
  protected _queue = Promise.resolve() as Promise<unknown>;
  /** Worker instance associated with this processor. */
  protected _worker?: Worker;
  /** Comlinked worker API. */
  protected _workerApi?: Remote<ProcessorWorkerApi>;
  /** ID from setTimeout */
  protected _workerTimeout?: number;

  public abortController = new AbortController();

  protected _terminateWorker() {
    if (!this._worker) return;
    this._worker.terminate();
    this._worker = undefined;
    this._workerApi = undefined;
    this.abortController = undefined;
  }

  protected async _startWorker() {
     this.abortController = new AbortController();
      this._worker = new Worker(new URL('./../features-worker/features.worker.ts', import.meta.url), {name: "features-worker"});
      this._workerApi = wrap<ProcessorWorkerApi>(this._worker)
  }
}


for (const methodName of methodNames) {
  WorkerBridge.prototype[methodName] = function (
    this: WorkerBridge,
    ...args: any
  ) {
    const signal = this.abortController.signal;
    this._queue = this._queue
      // Ignore any errors in the queue
      .catch(() => {})
      .then(async () => {
        if (signal.aborted) throw new DOMException('AbortError', 'AbortError');

        clearTimeout(this._workerTimeout);
        if (!this._worker) this._startWorker();

        const onAbort = () => this._terminateWorker();
        signal.addEventListener('abort', onAbort);

        return abortable(
          signal,
          // @ts-ignore - TypeScript can't figure this out
          this._workerApi[methodName](...args),
        ).finally(() => {
          // No longer care about aborting - this task is complete.
          signal.removeEventListener('abort', onAbort);

          // Start a timer to clear up the worker.
          setTimeout(() => {
            this._terminateWorker();
          }, workerTimeout);
        });
      });

    return this._queue;
  } as any;
}

export default WorkerBridge;
