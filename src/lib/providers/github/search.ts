import { z } from "zod";
import { env } from "~/lib/env";
import { ErrorWithCause } from "~/lib/errors";
import { getOctokit, getRedis, repoPattern } from "~/lib/utils";
import { FetchArgs, Fork } from "../common";
import { APIForkSchema, CustomForkSchema } from "./schema";

const search = async (query?: FetchArgs["repo"]): Promise<Fork[]> => {
  if (!query)
    throw new ErrorWithCause(
      "You haven't selected a repo yet!",
      "INVALID_REPO"
    );

  const fullRepo = query.join("/");

  const redis = getRedis();

  if (!repoPattern.test(fullRepo)) {
    throw new ErrorWithCause(
      "Invalid repo format! Please select a valid repo.",
      "INVALID_REPO"
    );
  }

  const cacheKey = `search:${fullRepo}`;

  const cached = await redis.get<string>(cacheKey);

  if (cached) {
    const parsed = typeof cached === "string" ? JSON.parse(cached) : cached;
    return z.array(CustomForkSchema).parse(parsed);
  }

  const octokit = getOctokit();

  const searchResponse = await octokit.rest.search.repos({
    q: fullRepo,
  });

  const searchResults = z.array(APIForkSchema).parse(searchResponse.data.items);

  const response: Fork[] = searchResults.map((result) => {
    return {
      link: result.html_url,
      name: result.name,
      branch: result.default_branch ?? "not available",
      forks: result.forks ?? 0,
      owner: result.owner.login,
      avatar: result.owner.avatar_url,
      stars: result.stargazers_count ?? 0,
      size: result.size,
      watchers: result.watchers_count ?? 0,
      openIssues: result.open_issues_count ?? 0,
      lastPush: result.pushed_at,
    };
  });

  const payload = JSON.stringify(response);
  await redis.set(cacheKey, payload, {
    ex: env.UPSTASH_REDIS_CACHE_TTL_SECONDS,
  });

  return response;
};

export default search;
