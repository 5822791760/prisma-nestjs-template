import { Provider } from '@nestjs/common';

import { RedisCacheProvider } from './cache/cache.provider';
import { CacheService } from './cache/cache.service';
import { NodeMailerProvider } from './email/email.provider';
import { EmailService } from './email/email.service';
import { LoggerService } from './logger/logger.service';
import { TransactionService } from './transaction/transaction.service';

export const GLOBAL_PROVIDER: Provider[] = [
  // Provider
  RedisCacheProvider,
  NodeMailerProvider,

  // Service
  LoggerService,
  TransactionService,
  CacheService,
  EmailService,
];
