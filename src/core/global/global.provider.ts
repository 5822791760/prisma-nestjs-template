import { Provider } from '@nestjs/common';

import { LoggerService } from './logger/logger.service';
import { TransactionService } from './transaction/transaction.service';

export const GLOBAL_PROVIDER: Provider[] = [LoggerService, TransactionService];
