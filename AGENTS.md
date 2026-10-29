# AI Agents Configuration

This document provides specialized configurations for AI coding assistants working with the `react-native-reanimated-modal` project.

## Project Overview

**react-native-reanimated-modal** is a high-performance React Native library that provides smooth, customizable modal components with 60fps animations running on the UI thread. The library is built on top of `react-native-reanimated` and `react-native-gesture-handler` for optimal performance.

### Key Technologies

- **React Native**: Cross-platform mobile development framework
- **react-native-reanimated**: High-performance animations on UI thread
- **react-native-gesture-handler**: Native gesture recognition
- **TypeScript**: Full type safety and enhanced DX
- **Expo**: Development toolchain for example app
- **Jest**: Unit testing framework

## Project Structure

```
├── src/                          # Main library source
│   ├── component.tsx            # Main Modal component
│   ├── types.ts                 # TypeScript type definitions
│   ├── config.ts                # Configuration constants and utilities
│   ├── styles.ts                # Styling definitions
│   ├── index.ts                 # Public API exports
│   └── __tests__/               # Unit tests
├── example/                     # Expo example application (workspace package)
│   ├── src/
│   │   ├── App.tsx              # Main app component
│   │   ├── Content.tsx          # Example showcase component
│   │   ├── use-cases/           # Usage examples
│   │   └── primitives/          # UI components
│   └── package.json             # Example app dependencies
├── docs/                        # Documentation site: Astro Starlight (workspace package)
│   ├── src/content/docs/        # The pages (Markdown / MDX)
│   ├── astro.config.mjs         # Sidebar, plugins, the order of llms.txt
│   └── public/images/           # example.gif, eas-update.svg (README uses them too)
├── .zed/                        # Zed editor: settings, tasks, debug configurations
├── pnpm-workspace.yaml          # Workspace packages, nodeLinker, allowBuilds, overrides
└── package.json                 # Library dependencies
```

## Commands (pnpm 12, Node from `.nvmrc`)

```bash
pnpm install          # the whole workspace: library, example/, docs/
pnpm typecheck        # tsc
pnpm lint             # eslint (+ prettier through eslint-plugin-prettier)
pnpm test             # jest
pnpm prepare          # bob build into lib/
pnpm validate         # typecheck + lint + test + prepare
pnpm example start    # the Expo example (also: ios, android, web)
pnpm docs dev         # docs on http://localhost:4321/react-native-reanimated-modal/
pnpm docs build       # astro check + the site in docs/dist/, links validated
```

One pnpm workspace, one `pnpm-lock.yaml`; pnpm is pinned by `packageManager`.
`nodeLinker: hoisted` keeps `node_modules` flat for Metro, Expo autolinking and
the React Native Jest preset. `pnpm example <cmd>` / `pnpm docs <cmd>` run a
package's script (`pnpm example exec expo …` for its binaries). Dependencies
with install scripts need an `allowBuilds` entry in `pnpm-workspace.yaml`;
version overrides live there too (`overrides`). Run local tools with
`pnpm exec <bin>`, not `npx`.

## Documentation (`docs/`)

The user documentation is the site, <https://whidrubeld.github.io/react-native-reanimated-modal/>;
the README is its storefront (features, install, quick start, links). The
setup follows three-map-terrain's docs (same look, same plugins).

- **Pages** (`docs/src/content/docs/`): one topic each, Markdown with a
  `title` and a `description` (the description is the page's line in
  `llms.txt`). The guide explains, `api/` is the reference, `llms` is for
  AI assistants. The sidebar and the order of `llms.txt` are in
  `astro.config.mjs` (`GUIDE`, `REFERENCE`): a new page goes there.
- **Truth**: pages describe what `src/` does, not what it was meant to do —
  check defaults in `config.ts` and behaviour in `component.tsx`. A change
  of the public API or of what users see updates its page (and the JSDoc
  in `types.ts`, which is what users see in their editor).
- **Links** between pages are absolute with the base,
  `/react-native-reanimated-modal/swipe/#directions`;
  `starlight-links-validator` fails the build on a dead page or anchor.
  Files in the repo are GitHub URLs.
- **For LLMs** (`starlight-llm-actions`): every page has a `.md` twin
  (Copy page, `<link rel="alternate">`), `llms.txt` and `llms-full.txt`;
  its optional peers (`unified`, `rehype-*`, `remark-*`, `unist-util-remove`,
  `hast-util-select`) are listed in `docs/package.json`.
- **Markdown** runs on Astro 7's Sätteri processor; `src/table-labels.mjs`
  gives table cells their column's name so rows stack into cards on a phone.
- **Look**: black and white, square, JetBrains Mono / Geist / Doto, pixel
  corner brackets (`.ticks`), HUD labels (`.hud`) — `src/styles/theme.css`
  over Starlight's cascade layers; fonts preloaded in `src/components/Head.astro`.
- **Deploy** (`gh-pages.yml`, from master): `pnpm docs build`, `docs/dist`
  to the `gh-pages` branch; `public/.nojekyll` keeps `_astro/`. CI builds
  the docs on every push and pull request.

## Core Features

### Modal Component Capabilities

- **Animation Types**: `fade`, `slide`, `scale`, `custom`
- **Gesture Support**: Swipe-to-dismiss in 4 directions (up, down, left, right)
- **Performance**: 60fps animations on UI thread via react-native-reanimated
- **Platform Integration**: Uses React Native's Modal component as foundation
- **Multi-Modal Support**: Supports multiple overlays and React Navigation integration

### Animation States

- `opening`: Modal is appearing
- `sliding`: User is swiping to dismiss
- `bouncing`: Modal bouncing back after insufficient swipe
- `closing`: Modal is disappearing

## Development Guidelines

### Code Quality Standards

#### TypeScript

- **Strict Mode**: Enabled with comprehensive checks
- **Type Safety**: All components must be fully typed
- **No `any` Types**: Use proper type definitions or generics
- **Interface Definitions**: Prefer interfaces over types for object shapes

#### Component Architecture

- **Functional Components**: Use React hooks, avoid class components
- **Performance Optimization**: Leverage `useCallback`, `useMemo`, `useAnimatedStyle`
- **Reanimated Best Practices**: Use `useSharedValue`, `withTiming`, `withSpring`
- **Gesture Handling**: Implement via `react-native-gesture-handler` API

#### Testing Requirements

- **Unit Tests**: All public APIs must have tests
- **Animation Testing**: Use `react-native-reanimated` testing utilities
- **Platform Testing**: Consider iOS/Android differences
- **Edge Cases**: Test gesture interactions and state transitions

### File Modification Guidelines

#### Core Library (`/src`)

- **component.tsx**: Main modal implementation, handle with care
- **types.ts**: Type definitions, ensure backward compatibility
- **config.ts**: Default configurations and utilities
- **styles.ts**: Styling constants and helper functions

#### Example App (`/example`)

- **Use Cases**: Add new examples in `use-cases/` directory
- **Primitives**: Reusable UI components in `primitives/`
- **Showcase**: Update `Content.tsx` for new examples

#### Testing (`/src/__tests__`)

- **Test Files**: Follow naming convention `*.test.tsx`
- **Coverage**: Aim for >90% code coverage
- **Mock Strategy**: Mock native modules appropriately

## Animation Development Patterns

### Reanimated Guidelines

```typescript
// ✅ Correct: Use useSharedValue for animated values
const progress = useSharedValue(0);
const animatedStyle = useAnimatedStyle(() => ({
  opacity: progress.value,
}));

// ❌ Avoid: Direct state mutations in animations
// Don't use useState for animated values
```

### Gesture Implementation

```typescript
// ✅ Correct: Proper gesture handling
const gesture = Gesture.Pan()
  .onBegin(() => {
    // Handle gesture start
  })
  .onChange((event) => {
    // Update shared values
  })
  .onEnd(() => {
    // Complete animation
  });
```

### Performance Considerations

- Use `runOnJS` sparingly for UI thread operations
- Prefer `useAnimatedReaction` for value watching
- Implement proper gesture cancellation
- Optimize re-renders with proper memoization

## Testing Strategies

### Unit Testing Approach

- **Component Rendering**: Test component mounting and props
- **Animation Logic**: Verify animation configurations
- **Gesture Interactions**: Mock and test gesture callbacks
- **Platform Behavior**: Test iOS/Android specific code paths

### Integration Testing

- **Modal States**: Test state transitions (open ↔ closed)
- **Animation Sequences**: Verify animation timing and curves
- **Gesture Recognition**: Test swipe thresholds and directions
- **Multi-Modal**: Test overlapping modal scenarios

## AI Assistant Specializations

### Code Generation Agent

**Focus**: Component creation, hook implementation, animation logic
**Strengths**: TypeScript patterns, React Native best practices, Reanimated APIs
**Use Cases**: New features, animation improvements, performance optimizations

### Testing Agent

**Focus**: Test creation, coverage analysis, edge case identification
**Strengths**: Jest configuration, React Native Testing Library, animation testing
**Use Cases**: Test suite expansion, regression testing, platform-specific tests

### Documentation Agent

**Focus**: API documentation, usage examples, migration guides
**Strengths**: Astro Starlight docs (`docs/`), example creation, architectural documentation
**Use Cases**: README updates, API references, tutorial creation

### Performance Agent

**Focus**: Bundle size optimization, animation performance, profiling
**Strengths**: Reanimated profiling, Metro bundler optimization, platform performance
**Use Cases**: Performance audits, bundle analysis, optimization strategies

## Common Patterns and Anti-Patterns

### ✅ Recommended Patterns

#### Animation Implementation

```typescript
// Smooth, cancellable animations
const showModal = useCallback(() => {
  progress.value = withTiming(1, {
    duration: 300,
    easing: Easing.out(Easing.cubic),
  });
}, []);
```

#### Gesture Handling

```typescript
// Proper gesture state management
const panGesture = useMemo(
  () =>
    Gesture.Pan()
      .activeOffsetY([-10, 10])
      .failOffsetX([-50, 50])
      .onUpdate(/* ... */)
      .onEnd(/* ... */),
  []
);
```

### ❌ Anti-Patterns to Avoid

```typescript
// ❌ Don't use setState for animations
const [opacity, setOpacity] = useState(0);

// ❌ Don't interpolate without bounds
interpolate(value, [0, 1], [0, 100]); // Missing extrapolate

// ❌ Don't create gestures in render
return (
  <GestureDetector gesture={Gesture.Pan().onUpdate(...)}>
    {/* ... */}
  </GestureDetector>
);
```

## Platform Considerations

### iOS Specific

- **Status Bar**: Handle status bar styling during modal presentation
- **Safe Areas**: Respect notch and home indicator areas
- **Haptics**: Consider iOS haptic feedback integration

### Android Specific

- **Hardware Back**: Implement Android back button handling
- **Status Bar**: Handle translucent status bar properly
- **Edge-to-Edge**: Support Android edge-to-edge display

### Cross-Platform

- **Dimensions**: Handle screen size and orientation changes
- **Performance**: Optimize for different hardware capabilities
- **Accessibility**: Implement proper accessibility features

## Dependency Management

### Key Dependencies

For current versions, always check `package.json` and `example/package.json`:

- **react-native-reanimated**: Core animation library (check for breaking changes between major versions)
- **react-native-gesture-handler**: Gesture recognition (ensure compatibility with Reanimated version)
- **react-native-worklets**: Required for Reanimated 4+ worklets support

### Compatibility Notes

- Project uses React Native New Architecture compatible versions
- Reanimated 4+ requires worklets for optimal performance
- iOS minimum version considerations for new animation APIs
- Android edge-to-edge display support requirements

## Agent Tooling

### Instructions

`AGENTS.md` (this file) is the only source of agent instructions: there is no
`.rules`, `.cursorrules`, `.clinerules` or `CLAUDE.md` next to it, because Zed
stops at the first instruction file it finds. Nested `AGENTS.md` files in
subdirectories are still read, so keep rules that apply to everyone here and
package-specific notes next to the code.

### Skills

Skills live in `.agents/skills/<name>/SKILL.md` — flat, one level, the file name
in capitals. Zed and DSH read both the worktree copy and `~/.agents/skills`.
The directory name is the skill's `name` (`[a-z0-9-]`, 1-64 characters, no dash
at the edges), `description` is at most 1024 characters, the body at most 500
lines; an invalid name makes the skill unload silently. Existing skills:

- `update-dependencies` — bump the library, the Expo example and the docs site
  together. The report runs from the repository root:
  `node .agents/skills/update-dependencies/scripts/deps-report.mjs`.

### MCP

No MCP servers are configured. A new one goes into `context_servers` of
`.zed/settings.json`, the single source of truth; there is no `.mcp.json`,
which Zed would not read anyway.

### Editors

Zed is the editor of record: `.zed/settings.json` (formatters, ESLint code
actions), `.zed/tasks.json` and `.zed/debug.json` are committed. Formatting and
linting rules live in the repository itself (`.editorconfig`, the `prettier`
key of the root `package.json`, `eslint.config.mjs`), so every editor picks up
the same configuration. `.vscode/` is gitignored and not part of the project.

---

_This configuration is optimized for the react-native-reanimated-modal project. Agents should prioritize performance, type safety, and cross-platform compatibility when working with this codebase._
