import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { EntityManager } from 'typeorm';

@Injectable()
export class TransactionService {
  private _transactionStorage = new AsyncLocalStorage<EntityManager>();

  setTransaction(trx: EntityManager) {
    this._transactionStorage.enterWith(trx);
  }

  getTransaction(): EntityManager | null {
    return this._transactionStorage.getStore() ?? null;
  }
}
