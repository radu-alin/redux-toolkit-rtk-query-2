export enum STATUS {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCEDED = 'succeded',
  FAILED = 'failed',
}

export type STATUS_OPTIONS =
  | STATUS.IDLE
  | STATUS.LOADING
  | STATUS.SUCCEDED
  | STATUS.FAILED;
