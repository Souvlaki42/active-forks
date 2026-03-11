"use server";

import type { Endpoints, RequestError as OctokitError } from "@octokit/types";
import { unstable_cache as cache } from "next/cache";
import { notFound } from "next/navigation";
import { Octokit } from "octokit";
import z from "zod";
import { env } from "~/lib/env";
import { tryCatch } from "~/lib/utils";

const MAX_TIMEOUT = 10000;
const MAX_DEPTH = 10;
const REVALIDATE_TIME = 60 * 60;

const argsSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  depth: z.number().min(0).default(0),
});

const forkSchema = z.object({
  link: z.string().min(1),
  owner: z.string().min(1),
  avatar: z.string().min(1),
  name: z.string().min(1),
  branch: z.string().default("Unavailable"),
  stars: z.number().min(0).default(0),
  watchers: z.number().min(0).default(0),
  forksCount: z.number().min(0).default(0),
  openIssues: z.number().min(0).default(0),
  size: z.number().min(0).default(0),
  lastPush: z.string().default("Unknown"),
});

type ActionArgsInput = z.input<typeof argsSchema>;

type RawFork =
  Endpoints["GET /repos/{owner}/{repo}/forks"]["response"]["data"][number];

export type Fork = z.output<typeof forkSchema> & {
  children?: Fork[];
};
type ForkInput = z.input<typeof forkSchema>;

const octokit = new Octokit({
  auth: env.GITHUB_API_TOKEN,
});

export const getForks = async (args: ActionArgsInput): Promise<Fork[]> => {
  const { success: argSuccess, data: argsData } = argsSchema.safeParse(args);

  if (!argSuccess) return [];

  const { owner, repo, depth } = argsData;

  const getForkLevelRaw = async () => {
    const { data, error } = await tryCatch<RawFork[], OctokitError>(
      octokit.paginate(octokit.rest.repos.listForks, {
        owner,
        repo,
        per_page: 100,
        request: {
          signal: AbortSignal.timeout(MAX_TIMEOUT),
        },
      }),
    );

    if (error) {
      console.warn(`github: ${error}`);
      if (depth !== 0) return [];
      if (error.status === 404) notFound();
      throw error;
    }

    const rawArray: ForkInput[] = data.map(
      (fork: RawFork): ForkInput => ({
        link: fork.html_url,
        name: fork.name,
        branch: fork.default_branch,
        forksCount: fork.forks_count,
        owner: fork.owner.login,
        avatar: fork.owner.avatar_url,
        stars: fork.stargazers_count,
        size: fork.size,
        watchers: fork.watchers_count,
        openIssues: fork.open_issues_count,
        lastPush: fork.pushed_at ?? undefined,
      }),
    );

    const parsedArray = forkSchema.array().safeParse(rawArray);

    if (!parsedArray.success) return [];

    return parsedArray.data;
  };

  const getForkLevel = env.FORCE_DISABLE_CACHE
    ? getForkLevelRaw
    : cache(getForkLevelRaw, [`github-forks:${owner}:${repo}`], {
        revalidate: REVALIDATE_TIME,
      });

  const forks: Fork[] = await getForkLevel();

  if (depth >= MAX_DEPTH || forks.length === 0) return forks;

  const children = await Promise.all(
    forks.map(async (fork) => {
      if (fork.forksCount > 0) {
        fork.children = await getForks({
          owner: fork.owner,
          repo: fork.name,
          depth: depth + 1,
        });
      }

      return fork;
    }),
  );

  return children;
};
