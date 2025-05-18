import { zodResponse } from '@core/shared/common/common.zod';

import { GetHealthOutput } from '../../health.schema';

export class GetHealthHttpResponse extends zodResponse(GetHealthOutput) {}
