import { StandardResponse } from '@core/shared/http/http.response.dto';

export class GetHealthOutput {
  heap: string;
  // rss: string;
  // db: string;
}

export class GetHealthResponse extends StandardResponse {
  data: GetHealthOutput;
}
