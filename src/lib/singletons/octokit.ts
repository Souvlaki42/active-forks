import { Octokit } from "octokit";
import { env } from "../env";

const getOctokit = () => {
  if (process.env.NODE_ENV === "production") {
    return new Octokit({ auth: env.GITHUB_API_TOKEN });
  }
  if (!__octokitClient) {
    __octokitClient = new Octokit({ auth: env.GITHUB_API_TOKEN });
  }
  return __octokitClient;
};

export const octokit = getOctokit();
