import { AutoComplete, tryCatch } from "~/utils";

import githubProvider from "./github/api";

export type Fork = {
	link: string;
	owner: string;
	avatar: string;
	name: string;
	branch: string;
	stars: number;
	watchers: number;
	forks: number;
	openIssues: number;
	size: number;
	lastPush?: string | null;
};

export type FetchArgs = {
	repo?: string;
	sort?: SortType;
	page?: number;
	perPage?: 10 | 30 | 50 | 100;
};

export type SortType = "newest" | "oldest" | "stargazers" | "watchers";

export type Providers = AutoComplete<"github">;

export type ForkResponse<TData = Fork> = {
	page: number;
	perPage: number;
	count: number;
	forks: TData[];
};

const providers: Record<Providers, (args: FetchArgs) => Promise<ForkResponse>> =
	{
		github: githubProvider,
	};

export const getForks = async (
	provider: Providers = "github",
	args: FetchArgs
) => {
	return await tryCatch(providers[provider](args));
};
