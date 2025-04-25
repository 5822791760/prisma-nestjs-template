import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class TransactionService {
  private _transactionStorage = new AsyncLocalStorage<any>();

  setTransaction(trx: any) {
    this._transactionStorage.enterWith(trx);
  }

  getTransaction(): any | null {
    return this._transactionStorage.getStore() ?? null;
  }
}
