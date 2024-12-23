# Development

After [forking the repo from GitHub](https://help.github.com/articles/fork-a-repo):

```shell
git clone https://github.com/ < your-name-here > /hitman-launcher
cd hitman-launcher
npm run setup
```

## Building

Run [**neu build**](https://neutralino.js.org/docs/cli/neu-cli/#neu-build) locally to bundle source files into the final application:

```shell
npm run build
```

Use [**neu run**](https://neutralino.js.org/docs/cli/neu-cli/#neu-run) to start the app in development mode with hot module reloading (HMR):

```shell
npm start
```

## Linting

This package includes ESLint to enforce consistent code quality and styling.

Pass the **--fix** flag to auto-fix some lint rule complaints:

```shell
npm run lint -- --fix
```
