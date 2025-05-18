import type { Redis } from "@upstash/redis";
import type { Octokit } from "octokit";

// eslint-disable-file no-namespace
declare global {
  let __octokitClient: Octokit | undefined;
  let __redisClient: Redis | undefined;
  let __urlPattern: RegExp | undefined;
  let __rtfCache:
    | Map<Intl.LocalesArgument, Intl.RelativeTimeFormat>
    | undefined;
}

export {};
