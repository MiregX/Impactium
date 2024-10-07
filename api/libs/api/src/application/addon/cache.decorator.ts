import { RedisService } from '@api/main/redis/redis.service';
import { λCache } from '@impactium/pattern';
/**
 * 
 * @param folder λCache c `@impactium/pattern`
 * @param ttl Число в секундах. Если есть - поставит на запись TTL. Если нет - вечная запись (использовать осторожно).
 */
export function Cache(folder: λCache, ttl?: number) {
  return function (
    _target: Object,
    _property: string,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    const method = descriptor.value;

    descriptor.value = async function (...args: string[]) {
      const key = RedisService.compare(...args);

      const redis: RedisService = this['redis'];

      const update = async () => {
        const data = await method.apply(this, args);

        return await redis.fsetux(folder, key, data, ttl);
      }

      return await redis.fget(folder, key) || await update();
    };

    return descriptor;
  };
}
