export enum STATUS {
  IDLE = 'idle',
  PENDING = 'pending',
  LOADING = 'loading',
  SUCCEDED = 'succeded',
  FAILED = 'failed',
}

export type STATUS_OPTIONS =
  | STATUS.IDLE
  | STATUS.PENDING
  | STATUS.LOADING
  | STATUS.SUCCEDED
  | STATUS.FAILED;
