import { Octokit } from "octokit";
import z from "zod";
import { env } from "~/lib/env";
import { cachedFetch } from "../utils";
import { type Fork, type Repo, RepoSchema } from "./schema";

const MAX_DEPTH = 10;

export const getForks = async (args: {
  repo: Repo;
  depth?: number;
}): Promise<Fork[]> => {
  const { repo, depth } = z
    .object({ repo: RepoSchema, depth: z.number().default(0) })
    .parse(args);
  if (!repo) return [];
  if (depth > MAX_DEPTH) return [];

  const [owner, name] = repo.split("/");

  const octokit = new Octokit({
    auth: env.GITHUB_API_TOKEN,
    request: {
      fetch: (url: string, options: RequestInit) =>
        cachedFetch(url, options, [`forks:${owner}/${name}`]),
    },
  });

  const response = await octokit.paginate(octokit.rest.repos.listForks, {
    owner,
    repo: name,
    per_page: 100,
  });

  const forksOfForks: typeof response = [];

  let data = response.map((fork) => {
    if (fork.forks !== 0) {
      forksOfForks.push(fork);
    }

    return {
      link: fork.html_url,
      name: fork.name,
      branch: fork.default_branch ?? "not available",
      forks: fork.forks ?? 0,
      owner: fork.owner.login,
      avatar: fork.owner.avatar_url,
      stars: fork.stargazers_count ?? 0,
      size: fork.size ?? 0,
      watchers: fork.watchers_count ?? 0,
      openIssues: fork.open_issues_count ?? 0,
      lastPush: fork.pushed_at ?? "Unknown",
    };
  });

  for (const fork of forksOfForks) {
    const response = await getForks({ repo: fork.full_name, depth: depth + 1 });
    data = [...data, ...response];
  }

  return data;
};
