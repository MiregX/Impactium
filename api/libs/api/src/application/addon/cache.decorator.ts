import { RedisService } from '@api/main/redis/redis.service';
import { λCache } from '@impactium/pattern';
import { Logger } from './logger.service';
/**
 * 
 * @param folder λCache c `@impactium/pattern`
 * @param ttl Число в секундах. Если есть - поставит на запись TTL. Если нет - вечная запись (использовать осторожно).
 */
export function Cache(folder: λCache, ttl?: number) {
  return function (
    _target: unknown,
    _property: string,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    const method = descriptor.value;

    descriptor.value = async function (...args: string[]) {
      const key = RedisService.compare(...args);

      const redis: RedisService = this['redis'];

      const update = async () => {
        const data = await method.apply(this, args);

        return redis ? await redis.fsetux(folder, key, data, ttl) : data;
      }

      if (!redis) {
        Logger.error('Redis was not found in context of Cache.decorator. Add RedisService as `redis` to service that uses it', 'CacheDecorator');
        return update();
      }

      return await redis.fget(folder, key) || await update();
    };

    return descriptor;
  };
}


/**
 * 
 * @param folder λCache c `@impactium/pattern`
 * @param ttl Число в секундах. Если есть - поставит на запись TTL. Если нет - вечная запись (использовать осторожно).
 */
export function Recache(folder: λCache) {
  return function (
    _target: unknown,
    _property: string,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    const method = descriptor.value;

    descriptor.value = async function (...args: string[]) {
      const key = RedisService.compare(...args);

      const redis: RedisService = this['redis'];

      await redis.del(folder, key);

      return await method.apply(this, args);
    };

    return descriptor;
  };
}
