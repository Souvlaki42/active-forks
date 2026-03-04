import { z } from "zod";
import { repoPattern } from "~/lib/utils";

export const ForkSchema = z.object({
  link: z.string(),
  owner: z.string(),
  avatar: z.string(),
  name: z.string(),
  branch: z.string(),
  stars: z.number(),
  watchers: z.number(),
  forks: z.number(),
  openIssues: z.number(),
  size: z.number().optional(),
  lastPush: z.string().nullable().optional(),
});
export type Fork = z.infer<typeof ForkSchema>;

export const ForkListSchema = z.object({
  total: z.number(),
  forks: z.array(ForkSchema),
});
export type ForkList = z.infer<typeof ForkListSchema>;

export const RepoSchema = z
  .string()
  .refine((value) => repoPattern.test(value), {
    message: "Invalid repo format! Please select a valid repo.",
  })
  .optional();

export type Repo = z.infer<typeof RepoSchema>;

export const ForkFetchArgsSchema = z.object({
  repo: RepoSchema,
  page: z.number().default(1),
  per_page: z
    .union([
      z.literal(10),
      z.literal(30),
      z.literal(50),
      z.literal(70),
      z.literal(100),
    ])
    .default(30),
});
export type ForkFetchArgs = z.infer<typeof ForkFetchArgsSchema>;

export const CompareArgsSchema = z.object({
  repo: RepoSchema,
  upstreamOwner: z.string(),
  upstreamBranch: z.string().default("main"),
  forkOwner: z.string(),
  forkBranch: z.string().default("main"),
});
export type CompareArgs = z.infer<typeof CompareArgsSchema>;

export const CompareResponseSchema = z.object({
  ahead: z.number(),
  behind: z.number(),
  status: z.enum(["ahead", "behind", "equal"]),
});
export type CompareResponse = z.infer<typeof CompareResponseSchema>;
