import { Redis } from "@upstash/redis";

const getRedis = () => {
  if (process.env.NODE_ENV === "production") {
    return Redis.fromEnv();
  }
  if (!__redisClient) {
    __redisClient = Redis.fromEnv();
  }
  return __redisClient;
};

export const redis = getRedis();
