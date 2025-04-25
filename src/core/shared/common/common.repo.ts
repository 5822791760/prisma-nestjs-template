import { Injectable } from '@nestjs/common';
import { DataSource, EntityTarget, ObjectLiteral, Repository } from 'typeorm';

import { TransactionService } from '@core/global/transaction/transaction.service';

import { ExceptionErr, Ok, Res } from './common.neverthrow';

@Injectable()
export abstract class BaseRepo {
  constructor(
    private dataSource: DataSource,
    private transactionService: TransactionService,
  ) {}

  async transaction<T>(
    callback: () => Promise<T>,
  ): Promise<Res<T, 'internal'>> {
    try {
      const res = await this.shardDb.main.transaction((tx) => {
        this.transactionService.setTransaction(tx);
        return callback();
      });

      return Ok(res);
    } catch (e: any) {
      return ExceptionErr('internal', e);
    }
  }

  from<T extends ObjectLiteral>(entity: EntityTarget<T>): Repository<T> {
    return this.db.getRepository(entity);
  }

  protected get db(): DataSource {
    let mainDb: DataSource =
      this._currentTransaction() as unknown as DataSource;
    if (!mainDb) {
      mainDb = this.shardDb.replica ?? this.shardDb.main;
    }

    return mainDb;
  }

  private get shardDb(): { main: DataSource; replica?: DataSource } {
    return { main: this.dataSource };
  }

  private _currentTransaction() {
    return this.transactionService.getTransaction();
  }
}
