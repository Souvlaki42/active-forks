import { z } from "zod";
import { env } from "~/lib/env";
import { ErrorWithCause } from "~/lib/errors";
import { getOctokit, getRedis, repoPattern } from "~/lib/utils";
import { FetchArgs, Fork } from "../common";
import { APIForkSchema, CustomForkSchema } from "./schema";

const forks = async ({ repo }: Pick<FetchArgs, "repo">): Promise<Fork[]> => {
  if (!repo)
    throw new ErrorWithCause(
      "You haven't selected a repo yet!",
      "INVALID_REPO"
    );

  const fullRepo = repo.join("/");

  const redis = getRedis();

  if (!repoPattern.test(fullRepo)) {
    throw new ErrorWithCause(
      "Invalid repo format! Please select a valid repo.",
      "INVALID_REPO"
    );
  }

  const [owner, name] = repo;

  const cacheKey = `forks:${owner}/${name}`;

  const cached = await redis.get<string>(cacheKey);

  if (cached) {
    const processed = typeof cached === "string" ? JSON.parse(cached) : cached;
    const parsed = z.array(CustomForkSchema).parse(processed);
    return parsed;
  }

  const octokit = getOctokit();

  const forkResponse = await octokit.paginate(octokit.rest.repos.listForks, {
    owner,
    repo: name,
  });

  const forks = z.array(APIForkSchema).parse(forkResponse);

  const response: Fork[] = forks.map((fork) => {
    return {
      link: fork.html_url,
      name: fork.name,
      branch: fork.default_branch ?? "not available",
      forks: fork.forks ?? 0,
      owner: fork.owner.login,
      avatar: fork.owner.avatar_url,
      stars: fork.stargazers_count ?? 0,
      size: fork.size,
      watchers: fork.watchers_count ?? 0,
      openIssues: fork.open_issues_count ?? 0,
      lastPush: fork.pushed_at,
    };
  });

  const payload = JSON.stringify(response);
  await redis.set(cacheKey, payload, {
    ex: env.UPSTASH_REDIS_CACHE_TTL_SECONDS,
  });

  return response;
};

export default forks;
