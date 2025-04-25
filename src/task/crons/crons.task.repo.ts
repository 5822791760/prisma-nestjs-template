import { Injectable } from '@nestjs/common';

import { BaseRepo } from '@core/shared/common/common.repo';

@Injectable()
export class CronsTaskRepo extends BaseRepo {}
