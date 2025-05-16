import { z } from "zod";
import { env } from "~/lib/env";
import { ErrorWithCause } from "~/lib/errors";
import { getOctokit, getRedis, repoPattern } from "~/lib/utils";
import { FetchArgs, ForkResponse } from "../common";
import { APIForkSchema, ForkResponseSchema } from "./schema";

const forks = async ({
  repo,
  page = 1,
  perPage = 30,
}: FetchArgs): Promise<ForkResponse> => {
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

  const cacheKey = `forks:${owner}/${name}&page=${page}&perPage=${perPage}`;

  const cached = await redis.get<string>(cacheKey);

  if (cached) {
    const parsed = typeof cached === "string" ? JSON.parse(cached) : cached;
    return ForkResponseSchema.parse(parsed);
  }

  const octokit = getOctokit();

  const forkResponse = await octokit.rest.repos.listForks({
    owner,
    repo: name,
    page,
    per_page: perPage,
  });

  const countResponse = await octokit.rest.search.repos({
    q: fullRepo,
  });

  const total = countResponse.data.items[0].forks_count;

  const forks = z.array(APIForkSchema).parse(forkResponse.data);

  const response: ForkResponse = {
    total,
    forks: forks.map((fork) => {
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
    }),
  };

  const payload = JSON.stringify(response);
  await redis.set(cacheKey, payload, {
    ex: env.UPSTASH_REDIS_CACHE_TTL_SECONDS,
  });

  return response;
};

export default forks;
