---
name: update-dependencies
description: Update dependencies of the library (root package.json) and the Expo example app (example/package.json) together - Expo SDK upgrades, React Native / Reanimated / Gesture Handler / Worklets bumps, dev tooling bumps, triaging Dependabot PRs. Use when asked to update, bump, upgrade, refresh or "актуализировать" dependencies, move the example to a new Expo SDK, or check what is outdated.
---

# Update dependencies

Layout: the root `package.json` is the published library (only `devDependencies`; `peerDependencies` are `*`). `example/` is an Expo app and a Yarn 3 workspace (`nmHoistingLimits: workspaces`). Both share one `yarn.lock`.

## Version rules

Apply in this order; a higher rule wins.

1. **The target Expo SDK decides every native package.** `expo/bundledNativeModules.json` of the target SDK (the latest one unless the user says otherwise) sets the versions of `react`, `react-dom`, `react-native`, `react-native-web`, `react-native-gesture-handler`, `react-native-reanimated`, `react-native-worklets`, `react-native-safe-area-context`, `react-native-keyboard-controller`, `expo-*`, `@expo/*`. Never take "npm latest" for these, even if Dependabot proposes it: a newer RN or Gesture Handler than the SDK pins breaks the example (Expo Go and EAS Update run the SDK's native binaries).
2. **The root mirrors the example for shared packages.** `react`, `react-native`, `react-native-gesture-handler`, `react-native-reanimated`, `react-native-worklets` get identical specifiers in both manifests. Different versions put two copies into `node_modules`, which breaks Metro and Jest ("Invalid hook call", duplicate native modules).
3. **Packages tied to the RN version.** `@react-native/babel-preset`, `@react-native/eslint-config`, `@react-native/jest-preset` are pinned to the exact RN version (`0.88.0`); if that patch is not published, use the latest patch of the same minor.
4. **Packages tied to the React version.** `@types/react` is pinned to the React version (or the latest patch of the same minor). `test-renderer` (used by `@testing-library/react-native` 14+) uses the line matching the React minor: React 19.3 means `~1.3.x`.
5. **Everything else** (dev tooling, non-SDK example deps) goes to npm latest, but only if its `peerDependencies` and `engines` fit the rest of the stack. Check before any major bump:
   ```sh
   npm view <pkg>@<version> peerDependencies engines
   ```
   Known blockers. Re-check them every time, because they get lifted:
   - `eslint`, `@eslint/js`: stay on the major allowed by the `@react-native/eslint-config` peer range (`^8 || ^9` as of 0.88). Yarn prints eslint 9 as deprecated; that is expected until RN supports 10.
   - `typescript`: stay within the `typedoc` peer range (`<= 6.0.x` as of typedoc 0.28.20). The Expo template's TypeScript version (`npm view expo-template-blank-typescript@sdk-<N> devDependencies`) is a good reference.
   - `@babel/core` in the example: the Expo and RN toolchain is on Babel 7 (`babel-preset-expo` and `@react-native/babel-preset` depend on `@babel/core ^7`). Do not move to Babel 8 until they do.
6. **Node.** `.nvmrc` must satisfy `engines.node` of `react-native`, `expo` and the tooling (the report script prints these). CI reads `.nvmrc` through `.github/actions/setup`.
7. **Library source stays compatible with older peers.** Peers are `*`, so consumers may still be on older majors. Don't migrate `src/*.tsx` to APIs that exist only in the new major (for example the Gesture Handler 3 hook API `usePanGesture`) as part of a dependency update. Deprecated-but-working APIs are acceptable; report the deprecation to the user instead. Small fixes that work on old and new versions alike (such as dropping an ignored argument that now triggers a warning) are fine. Test files (`src/__tests__`) and the example app may use new APIs.
8. Don't change `peerDependencies` or the `.github/workflows/compatibility.yml` matrix unless asked.

`create-react-native-library` (the scaffold this repo came from) is a useful reference for tooling versions and config formats. Its templates show what the current toolchain expects (eslint, lefthook, release-it, jest, metro):

```sh
npm pack create-react-native-library@latest   # then read package/templates/**
```

## Procedure

Run local tools through `yarn <bin>` (`yarn prettier`, `yarn eslint`), not `npx <bin>`: the Yarn 3 node-modules linker can leave bin files without the execute bit, and `npx` then fails with "Permission denied".

### 1. Prepare

- Start from a clean tree on `dev`, the branch Dependabot targets. Don't commit unless the user asks.
- Record a baseline: `yarn typecheck && yarn lint && yarn test`. Note any failures that exist before the update so they aren't blamed on it.

### 2. Report

```sh
node .skills/update-dependencies/scripts/deps-report.mjs           # target: latest Expo SDK
node .skills/update-dependencies/scripts/deps-report.mjs --sdk 58  # a specific SDK
```

The script prints spec, installed, latest and Expo-recommended versions for every dependency. It also prints the Node engines of the target `expo`/`react-native` and flags breaking bumps (`MAJOR`), SDK mismatches (`!expo`) and root/example drift (`root!=example`).

Open Dependabot branches are a hint, never the answer, because rule 1 overrides them:

```sh
git for-each-ref --sort=-committerdate --format='%(committerdate:short) %(refname:short)' refs/remotes/origin/dependabot
git log -1 --format=%B origin/dependabot/<branch>
```

For every `MAJOR` you plan to take, read the migration guide or changelog. The npm tarball usually ships it (`npm pack <pkg>@<version>`, then look in `docs/`, `CHANGELOG.md`, `README.md`). Check `peerDependencies`/`engines` too (rule 5). Decide the full target list before editing anything.

### 3. Edit the manifests

- `example/package.json`: set `expo` to the target SDK (keep the existing `^NN.0.0` style) and every SDK-managed package to the exact specifier from `bundledNativeModules.json`. Bump non-SDK deps per rule 5.
- `package.json`: mirror the shared packages (rule 2), pin the RN- and React-tied packages (rules 3 and 4), bump tooling per rule 5. Keep the existing specifier style per package (exact pins stay exact, `^` stays `^`).
- `.nvmrc`: bump if rule 6 requires it.
- Root `resolutions` are workarounds; find out why each exists (`git log -S'"<pkg>"' -- package.json`) before touching it. `jest-mock`/`jest-environment-node` force Jest 30 because `@react-native/jest-preset` still depends on `jest-environment-node ^29`; keep them on the same version as `jest` for as long as that's true.

Both manifests round-trip through `JSON.stringify(pkg, null, 2) + '\n'` without formatting changes, so a small Node script is the cleanest way to edit many versions at once.

### 4. Install and align

```sh
yarn install
yarn example expo install --check   # must say "Dependencies are up to date"; fix with --fix
yarn dedupe
yarn install --immutable            # what CI runs; must not change the lockfile
```

Check the lockfile has exactly one version of each shared package (`grep -E '^"?react(-native)?@npm:' yarn.lock`). Two physical copies (`node_modules` and `example/node_modules`) of the same version are expected with `nmHoistingLimits: workspaces`.

Read the `yarn install` peer warnings (`YN0060` incompatible, `YN0002` missing) for the packages you touched; `yarn explain peer-requirements <hash>` shows who asks for what. Many warnings are long-standing noise (for example `eslint-plugin-ft-flow` wanting eslint 8, or `@babel/core` missing for `react-native-worklets`); only act on new ones caused by the update.

### 5. Migrate code and config

Apply what the migration guides require: test code, eslint, jest, babel, metro, lefthook or release-it config. Keep rule 7 in mind for `src/`. See "Pitfalls seen in past updates" below.

### 6. Verify

Everything must pass:

```sh
yarn typecheck
yarn lint
yarn test
yarn prepare                                          # bob build into lib/
yarn docs --out <scratch dir>/docs                    # typedoc
yarn example expo export --platform web --output-dir <scratch dir>/web                         # CI build-web
yarn example expo export --platform ios --platform android --output-dir <scratch dir>/native   # Metro resolves native code paths
(cd example && npx --yes expo-doctor@latest)          # must pass all checks
yarn lefthook run pre-commit --all-files              # git hooks still work
echo "chore(deps): test" | yarn commitlint
```

- Build docs into a scratch directory. A `docs/` folder in the repo is gitignored but not eslint-ignored, and `yarn lint` crashes on it with `RangeError: Invalid string length`.
- `expo-doctor` failures about missing peer dependencies are fixed with `yarn example expo install <pkg>`. It may add a config plugin to `example/app.json`; keep the file's formatting (single-line arrays).
- If test, animation or gesture libraries changed, run the suite the way CI does several times to catch races: `for i in $(seq 1 10); do yarn test --maxWorkers=2 --coverage || break; done`, then delete `coverage/`.

Unit tests can't verify gestures or animations on a device. If the RN, Reanimated, Worklets or Gesture Handler versions changed, tell the user to smoke-test the example (`yarn example ios` / `yarn example android`: swipe-to-dismiss in all directions, backdrop press, Android back button).

### 7. Bookkeeping

- `.github/dependabot.yml`: add newly introduced Expo-managed packages to `ignore` (`expo-*` and `@expo/*` are covered by patterns already).
- README "Version Compatibility" table: update it only if the library's own compatibility changed (for example, a new minimum `react-native-worklets`).
- After an Expo SDK upgrade, the EAS Update QR code in the README (`.github/images/eas-update.svg`) has to be regenerated once an update is published for the new runtime. Remind the user; it can't be done from here.
- Dependabot PRs made obsolete by the update: list them for the user to close.
- Remove anything you generated inside the repo (`docs/`, `coverage/`, `example/dist/`). `lib/` is rebuilt by `yarn prepare` and is gitignored.

### 8. Report and commit

Give the user:

- a table of what changed (from → to) for both manifests,
- what was held back and why (blocking peer range, engines, Expo pin),
- code and config migrations made,
- verification results, plus follow-ups (device smoke test, QR code, Dependabot PRs).

Commit only when asked. Messages follow Conventional Commits (commitlint runs in the `commit-msg` hook). History uses `feat: upgrade support Expo SDK <N>` for SDK upgrades; use `chore(deps): ...` for tooling-only bumps.

## Pitfalls seen in past updates

Expo SDK 57 → 58 (Oct 2026): RN 0.86 → 0.88, Reanimated 4.5 → 4.7, Worklets 0.10 → 0.13, Gesture Handler 2.32 → 3.3, RNTL 13 → 14.

- **Reanimated 4.7 in Jest** fails at import with ``[Reanimated] `setCSSEventHandler` is not available in JSReanimated`` unless the Jest config has `"resolver": "react-native-reanimated/jest/resolver"`. That resolver also routes `react-native-worklets` to its web build. It replaces the `@react-native/jest-preset` resolver (which strips `exports` from `react-native`), and that is harmless: the preset's `moduleNameMapper` already resolves `react-native/...` subpaths, and a full-suite comparison showed no resolution differences. After any Reanimated or Worklets bump, check their `jest/` folders for changes.
- **Reanimated 4.7 warns** "Dependencies should only be used on the web" whenever a dependency array is passed to a worklet hook (`useAnimatedReaction(prepare, react, [])`). Drop the array; that works on every Reanimated version.
- **Gesture Handler 3**: `GestureDetector` now throws "must be used as a descendant of GestureHandlerRootView" in Jest too (v2 skipped the check in test environments). Tests import `render` from `src/__tests__/test-utils.tsx`, which re-exports RNTL and wraps every render in `GestureHandlerRootView`; put any future shared test setup there too. Jest's `testMatch` is limited to `*.test.*` so helpers in `__tests__` aren't run as suites. The `Gesture.Pan()` builder API is deprecated but still supported by the v3 `GestureDetector`; keep it in `src/` (rule 7).
- **RNTL 14**: `render`, `fireEvent`, `act` and `renderHook` are async; `react-test-renderer` is replaced by `test-renderer` (rule 4). The new async timing exposes assertions that depend on an animation finishing. Wait for the observable result with `waitFor` (the Android back-button tests poll the registered handler until it intercepts) rather than for a callback such as `onShow`, which fires before React commits the follow-up render.
- **`npm view --json`** returns an array for single fields with some npm versions; take the last element (the report script does).
