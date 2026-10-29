# Contributing

Contributions are always welcome, no matter how large or small!

We want this community to be friendly and respectful to each other. Please follow it in all your interactions with the project. Before contributing, please read the [code of conduct](./CODE_OF_CONDUCT.md).

## Development workflow

The repository is a [pnpm workspace](https://pnpm.io/workspaces) with one lockfile, `pnpm-lock.yaml`:

- the library in the root directory;
- the Expo example app in `example/`;
- the documentation site (Astro Starlight) in `docs/`.

pnpm is pinned by `packageManager` in `package.json` and Node by `.nvmrc`. Install everything from the root:

```sh
pnpm install
```

> The workspace uses pnpm's `nodeLinker: hoisted` (a flat `node_modules`, as Metro and the React Native Jest preset expect). Use pnpm, not npm or Yarn, for development.

The [example app](/example/) demonstrates usage of the library. You need to run it to test any changes you make. It uses the library's source (`src/`) through Metro, so changes to the library's JavaScript show up without a rebuild; native code changes need a rebuild of the example app.

Start the packager:

```sh
pnpm example start
```

Run the example app on Android, iOS or the web:

```sh
pnpm example android
pnpm example ios
pnpm example web
```

To confirm that the app is running with the new architecture, check the Metro logs for a message like this:

```sh
Running "ReanimatedModalExample" with {"fabric":true,"initialProps":{"concurrentRoot":true},"rootTag":1}
```

Note the `"fabric":true` and `"concurrentRoot":true` properties.

Make sure your code passes TypeScript and ESLint:

```sh
pnpm typecheck
pnpm lint
```

To fix formatting errors:

```sh
pnpm lint --fix
```

Remember to add tests for your change if possible. Run the unit tests with:

```sh
pnpm test
```

`pnpm validate` runs all of it — typecheck, lint, tests and the build — as CI does.

### Documentation

The documentation is [`docs/`](docs), <https://whidrubeld.github.io/react-native-reanimated-modal/>. A change of the public API or of what users see updates its page there:

```sh
pnpm docs dev     # http://localhost:4321/react-native-reanimated-modal/
pnpm docs build   # astro check, the site, internal links validated
```

The README is the storefront — features, install, quick start, links — and points to the docs for the rest.

### Editor

The repository ships a [Zed](https://zed.dev) setup in `.zed/`: format on save with Prettier and ESLint fixes, tasks for every script (`task: spawn`), Jest runnables in test files, and debug configurations for Jest, the example on the web and the docs.

### Commit message convention

We follow the [conventional commits specification](https://www.conventionalcommits.org/en) for our commit messages:

- `fix`: bug fixes, e.g. fix crash due to deprecated method.
- `feat`: new features, e.g. add new method to the module.
- `refactor`: code refactor, e.g. migrate from class components to hooks.
- `docs`: changes into documentation, e.g. add usage example for the module.
- `test`: adding or updating tests, e.g. add integration tests using detox.
- `chore`: tooling changes, e.g. change CI config.

Our pre-commit hooks ([lefthook](https://lefthook.dev), installed by `pnpm install`) verify that your commit message matches this format when committing.

### Linting and tests

We use [TypeScript](https://www.typescriptlang.org/) for type checking, [ESLint](https://eslint.org/) with [Prettier](https://prettier.io/) for linting and formatting the code, and [Jest](https://jestjs.io/) for testing.

Our pre-commit hooks verify that the linter and the type checker pass when committing.

### Publishing to npm

The version in the root `package.json` is the release. Bump it and push the change
to `master`:

```sh
pnpm release # release-it --only-version: only the version in package.json
```

A push to `master` that changes the version runs `.github/workflows/publish.yml`:
it lints, type-checks, tests, builds, publishes to npm and creates the GitHub
release — the changelog since the previous tag, the tag itself. A push that
leaves the version alone publishes nothing.

npm authenticates with OIDC through the package's Trusted Publisher on
npmjs.com (`publish.yml`), so there is no `NPM_TOKEN` and nothing to rotate.
To publish a version whose commit is already in `master` — a failed run, a
backfill:

```sh
gh workflow run publish.yml -f tag=v1.3.3
```

### Scripts

The `package.json` file contains various scripts for common tasks:

- `pnpm install`: set up the project by installing dependencies.
- `pnpm typecheck`: type-check files with TypeScript.
- `pnpm lint`: lint files with ESLint.
- `pnpm test`: run unit tests with Jest.
- `pnpm prepare`: build the library into `lib/` with react-native-builder-bob.
- `pnpm validate`: all of the above, as CI runs them.
- `pnpm example <script>`: run a script of the example app — `start`, `android`, `ios`, `web`.
- `pnpm run docs <script>`: run a script of the docs — `dev`, `build`, `preview`. The `run`
  is needed: pnpm has a built-in `pnpm docs <package>` that would shadow it.

### Sending a pull request

> **Working on your first pull request?** You can learn how from this _free_ series: [How to Contribute to an Open Source Project on GitHub](https://app.egghead.io/playlists/how-to-contribute-to-an-open-source-project-on-github).

When you're sending a pull request:

- Prefer small pull requests focused on one change.
- Verify that linters and tests are passing.
- Review the documentation to make sure it looks good.
- Follow the pull request template when opening a pull request.
- For pull requests that change the API or implementation, discuss with maintainers first by opening an issue.
