# Active Forks Extension

This extension provides a button on Git providers that sends you to [Active Forks](../web).

![Screenshot of the extension](screenshots/current.png)
This might be outdated, but it's the best I could do.

## Installation

For now, the extension is not available for installation, in the stores. If there is demand, I'll publish them there.

## Development

To develop the extension, follow these steps:

1. Clone the repository.
2. Install the dependencies: `pnpm install`.
3. Setup the environment variables:

- Put `WTX_APP_URL=https://forks.moulas.dev` in a `.env` file in the root of the project.
- If you are using Chromium, put `CHROME_PATH={path_to_chrome_executable}` in the `.env` file.
- If you are using Firefox, just make sure you have Firefox installed as the binary `firefox` is in your `PATH`.

4. Build the extension: `pnpm --filter=@workspace/extension build` or `pnpm --filter=@workspace/extension build:firefox`.
   You can also run the dev server: `pnpm --filter=@workspace/extension dev` or `pnpm --filter=@workspace/extension dev:firefox`.
5. Load the extension in your browser as unpacked extension in developer mode.
