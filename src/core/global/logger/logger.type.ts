export interface TraceLog {
  traceId: string;
  requestTime: string;
  message: string;
  data?: any;
}

export interface ErrorLog {
  message: string;
  stack: string;
}
