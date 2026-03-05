import { Octokit } from "octokit";

import { env } from "~/lib/env";
import {
  type ForkFetchArgs,
  ForkFetchArgsSchema,
  type ForkList,
} from "./schema";

const REVALIDATE_MINUTES = 5;

export const getForks = async (args: ForkFetchArgs): Promise<ForkList> => {
  console.info(`Fetching forks: ${JSON.stringify(args)}`);

  const { repo, page, per_page } = ForkFetchArgsSchema.parse(args);

  if (!repo) return { total: 0, forks: [] };

  const [owner, name] = repo.split("/");

  const octokit = new Octokit({
    auth: env.GITHUB_API_TOKEN,
    request: {
      fetch: (url: string, options: RequestInit) =>
        // WARNING: Data caching here only works when I use Vercel's infrastructure
        fetch(url, {
          ...options,
          next: {
            revalidate: REVALIDATE_MINUTES * 60,
            tags: [`forks:${owner}/${name}`],
          },
        }),
    },
  });

  const forkRequest = octokit.rest.repos.listForks({
    owner,
    repo: name,
    page,
    per_page,
    sort: "stargazers",
  });

  const getRequest = octokit.rest.repos.get({ owner, repo: name });

  const APIResponse = await Promise.all([forkRequest, getRequest]);

  const response: ForkList = {
    total: APIResponse[1].data.forks_count ?? 0,
    forks: APIResponse[0].data.map((fork) => {
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
        lastPush: fork.pushed_at,
      };
    }),
  };

  return response;
};
