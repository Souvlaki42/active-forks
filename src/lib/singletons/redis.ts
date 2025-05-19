import { Redis } from "@upstash/redis";

let __redisClient: Redis | undefined;

const getRedis = () => {
  if (!__redisClient) {
    __redisClient = Redis.fromEnv();
  }
  return __redisClient;
};

export const redis = getRedis();
