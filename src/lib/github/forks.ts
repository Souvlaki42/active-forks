import { octokit } from "~/lib/singletons/octokit";
import {
  type ForkFetchArgs,
  ForkFetchArgsSchema,
  type ForkList,
} from "./schema";

export const getForks = async (args: ForkFetchArgs): Promise<ForkList> => {
  console.info(`Fetching forks: ${JSON.stringify(args)}`);

  const { repo, page, per_page } = ForkFetchArgsSchema.parse(args);

  if (!repo) return { total: 0, forks: [] };

  const partRepo = repo.split("/");

  const [owner, name] = partRepo;

  const forkResponse = await octokit.rest.repos.listForks({
    owner,
    repo: name,
    page,
    per_page,
    sort: "stargazers",
  });

  const searchResponse = await octokit.rest.search.repos({
    q: repo,
  });

  const total = searchResponse.data.items[0].forks ?? 0;

  const { data: forks } = forkResponse;

  const response: ForkList = {
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
        size: fork.size ?? 0,
        watchers: fork.watchers_count ?? 0,
        openIssues: fork.open_issues_count ?? 0,
        lastPush: fork.pushed_at,
      };
    }),
  };

  return response;
};
