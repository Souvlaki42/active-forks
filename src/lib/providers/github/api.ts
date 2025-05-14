import { env } from "~/lib/env";
import { getOctokit, getRedis } from "~/lib/utils";
import { FetchArgs, ForkResponse } from "../common";
import { ListOfForksSchema } from "./schema";

const forks = async ({
	repo,
	sort = "newest",
	page = 1,
	perPage = 30,
}: FetchArgs): Promise<ForkResponse> => {
	if (!repo) throw new Error("You haven't selected a repo yet!");

	const octokit = getOctokit();
	const redis = getRedis();

	const [owner, name] = repo.split("/", 2);

	const redisKey = `forks:${owner}/${name}?sort=${sort}&page=${page}&perPage=${perPage}`;

	let cached = await redis.get<string>(redisKey);

	if (cached) {
		return JSON.parse(cached) as ForkResponse;
	}

	const forkResponse = await octokit.rest.repos.listForks({
		owner,
		repo: name,
		sort,
		page,
		per_page: perPage,
	});

	const countResponse = await octokit.rest.search.repos({
		q: repo,
	});

	if (forkResponse.status != 200 || countResponse.status != 200)
		throw new Error(
			"The selected repo doesn't exist or has no forks! Try again."
		);

	const start = (page - 1) * perPage;
	const end = start + perPage;

	const total = countResponse.data.items[0].forks_count;

	const forks = ListOfForksSchema.parse(forkResponse.data);

	const response = {
		pagination: {
			start,
			end,
			total,
		},
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

	await redis.set(redisKey, JSON.stringify(response));
	await redis.expire(redisKey, env.UPSTASH_REDIS_CACHE_TTL_SECONDS);

	return response;
};

export default forks;
