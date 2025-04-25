import { Injectable } from '@nestjs/common';

import { CoreDB } from '@core/db/db.common';
import { TransactionService } from '@core/global/transaction/transaction.service';

import { ExceptionErr, Ok, Res } from './common.neverthrow';

@Injectable()
export abstract class BaseRepo {
  constructor(
    private coreDb: CoreDB,
    private transactionService: TransactionService,
  ) {}

  async transaction<T>(
    callback: () => Promise<T>,
  ): Promise<Res<T, 'internal'>> {
    try {
      const res = await this.shardDb.main.$transaction((tx) => {
        this.transactionService.setTransaction(tx);
        return callback();
      });

      return Ok(res);
    } catch (e: any) {
      return ExceptionErr('internal', e);
    }
  }

  get db(): CoreDB {
    let mainDb: CoreDB = this._currentTransaction() as unknown as CoreDB;
    if (!mainDb) {
      mainDb = this.shardDb.replica ?? this.shardDb.main;
    }

    return mainDb;
  }

  private get shardDb(): { main: CoreDB; replica?: CoreDB } {
    return { main: this.coreDb };
  }

  private _currentTransaction() {
    return this.transactionService.getTransaction();
  }
}
