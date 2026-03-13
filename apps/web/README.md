# Active Forks Web

A web app that shows the active forks of a Git repository.

## Features

Search for forks by name
Filter by owner, default branch, stars, forks, watchers, open issues, size, and last push date
Sort by stars, forks, watchers, open issues, size, and last push date
Recursively search fork networks
Hide columns
Responsive design

View forks on GitHub
View forks on GitLab (might come soon)
View forks on Bitbucket (might come soon)
View forks on Gitea (might come soon)

![Screenshot of the app](screenshots/current.png)
This might be outdated, but it's the best I could do.

## TODO

For todos, work in progress, and ideas, see [the project board](https://github.com/users/Souvlaki42/projects/3).

## Getting Started

First, fork the repo and clone it.

Then, install the dependencies: `pnpm install`

### GitHub API

You need to have a GitHub API token with the `repo` scope. You can create a new token on the [GitHub token creation page](https://github.com/settings/tokens/new).

Once you have the token, you need to set the `GITHUB_API_TOKEN` environment variable to the token.

Lastly, run the development server: `pnpm dev`

And open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
