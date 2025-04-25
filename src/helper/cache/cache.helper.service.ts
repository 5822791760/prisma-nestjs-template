import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

import { ExceptionErr, Ok, Res } from '@core/shared/common/common.neverthrow';

import { REDIS_CLIENT } from './cache.helper.provider';

@Injectable()
export class CacheHelperService {
  constructor(
    @Inject(REDIS_CLIENT)
    private redisClient: RedisClientType,
  ) {}

  async get<T>(
    key: string,
  ): Promise<Res<string | T | null, 'notFound' | 'fail'>> {
    if (!this._isEnable()) {
      return Ok(null);
    }

    try {
      const val = await this.redisClient.get(key);
      if (!val) {
        return Ok(null);
      }

      const parsedObj = JSON.parse(val);
      return Ok(parsedObj);
    } catch (e: any) {
      return ExceptionErr('fail', e);
    }
  }

  async set(
    key: string,
    data: string | Record<string, any>,
    ttlInSeconds = 3600,
  ): Promise<Res<null, 'fail'>> {
    if (!this._isEnable()) {
      return Ok(null);
    }

    try {
      await this.redisClient.set(key, JSON.stringify(data), {
        EX: ttlInSeconds,
      });
      return Ok(null);
    } catch (e: any) {
      return ExceptionErr('fail', e);
    }
  }

  async delete(key: string): Promise<Res<null, 'fail'>> {
    if (!this._isEnable()) {
      return Ok(null);
    }

    try {
      await this.redisClient.del(key);
      return Ok(null);
    } catch (e: any) {
      return ExceptionErr('fail', e);
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this._isEnable()) {
      return false;
    }

    try {
      const exists = await this.redisClient.exists(key);
      return exists > 0;
    } catch (error) {
      return false;
    }
  }

  private _isEnable() {
    return this.redisClient.isOpen;
  }
}
