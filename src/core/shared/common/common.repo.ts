import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppConfig } from '@core/config';
import { CORE_DB, CoreDB } from '@core/db/db.common';
import { TransactionService } from '@core/global/transaction/transaction.service';

import { isTesting } from './common.func';
import { ExceptionErr, Ok, Res } from './common.neverthrow';

@Injectable()
export abstract class BaseRepo {
  constructor(
    @Inject(CORE_DB)
    private coreDb: CoreDB,
    private transactionService: TransactionService,
    private configService: ConfigService,
  ) {}

  async transaction<T>(
    callback: () => Promise<T>,
  ): Promise<Res<T, 'internal'>> {
    const appConfig = this.configService.getOrThrow<AppConfig['app']>('app');
    try {
      if (isTesting(appConfig.nodeEnv)) {
        // No transaction in test
        const res = await callback();
        return Ok(res);
      }

      const res = await this.shardDb.main.$transaction((tx) => {
        this.transactionService.setTransaction(tx);
        return callback();
      });

      return Ok(res);
    } catch (e: any) {
      return ExceptionErr('internal', e);
    }
  }

  protected get db(): CoreDB {
    let mainDb: CoreDB = this._currentTransaction() as unknown as CoreDB;
    if (!mainDb) {
      mainDb = this.shardDb.main;
    }

    return mainDb;
  }

  // If DB is sharded can switch base on context here
  private get shardDb(): { main: CoreDB } {
    return { main: this.coreDb };
  }

  private _currentTransaction() {
    return this.transactionService.getTransaction();
  }
}
