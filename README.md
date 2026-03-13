# Active Forks

This project is now a [PNPM](https://pnpm.io/) workspace/monorepo. Thus, you need it for development.

Specifically, you need Node.js version 24.0.0 or higher and PNPM version 10.32.1 or higher.

It contains both the [web app](apps/web) and the [browser extension](apps/extension).

## Development

Go to the [web app instructions](apps/web/README.md) or the [browser extension instructions](apps/extension/README.md) to learn more.

Just remember to prefix `pnpm` commands like `pnpm run dev` with `pnpm --filter` to run them in the context of the workspace.

For example, to run the development server for the web app, use `pnpm --filter @workspace/web run dev`.

Or, to run the development server for the browser extension, use `pnpm --filter @workspace/extension run dev`.

The `pnpm install` command and scripts such as `format`, `lint`, and `ci` are meant to run at the workspace level without a filter.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Credits

This project is inspired by [active-forks](https://github.com/techgaun/active-forks) by [techgaun](https://github.com/techgaun).

Using [Lucide Icons](https://lucide.dev/icons) from [Lucide React](https://lucide.dev/guide/packages/lucide-react) and [GitHub Octicons](https://iconbuddy.com/octicon) from [Icon Buddy](https://iconbuddy.com).

The query builder is powered by [React Query Builder](https://react-querybuilder.js.org/) and [Jide's shadcn/ui adaptation of React Query Builder](https://github.com/jide/react-querybuilder-shadcn-ui).

## License

This project is still licensed under the [Apache License 2.0](LICENSE) as a whole.
