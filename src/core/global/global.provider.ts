import { Provider } from '@nestjs/common';

import { RedisCacheProvider } from './cache/cache.provider';
import { CacheService } from './cache/cache.service';
import { NodeMailerProvider } from './email/email.provider';
import { EmailService } from './email/email.service';
import { LangService } from './lang/lang.service';
import { LoggerService } from './logger/logger.service';
import { StorageProvider } from './storage/storage.provider';
import { StorageService } from './storage/storage.service';
import { TransactionService } from './transaction/transaction.service';

export const GLOBAL_PROVIDER: Provider[] = [
  // Provider
  RedisCacheProvider,
  NodeMailerProvider,
  StorageProvider,

  // Service
  LoggerService,
  TransactionService,
  CacheService,
  EmailService,
  LangService,
  StorageService,
];
