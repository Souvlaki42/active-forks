import { Octokit } from "octokit";
import { env } from "../env";

let __octokitClient: Octokit | undefined;

const getOctokit = () => {
  if (!__octokitClient) {
    __octokitClient = new Octokit({ auth: env.GITHUB_API_TOKEN });
  }
  return __octokitClient;
};

export const octokit = getOctokit();
