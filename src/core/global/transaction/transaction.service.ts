import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class TransactionService {
  private _transactionStorage = new AsyncLocalStorage<any>();
  private _testTransaction: any = null;

  setTransaction(trx: any) {
    this._transactionStorage.enterWith(trx);
  }

  getTransaction(): any | null {
    return this._transactionStorage.getStore() ?? null;
  }

  clearTransaction() {
    this._transactionStorage.disable();
  }

  __setTestTransaction(trx: any) {
    this._testTransaction = trx;
  }

  __getTestTransaction() {
    return this._testTransaction;
  }

  __clearTestTransaction() {
    this._testTransaction = null;
  }
}
