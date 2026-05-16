# CardQuest Todo

A small Expo + React Native todo app that demonstrates the mobile stack we discussed for the TCG collector product. It uses a collector-themed task board to show how React Native screens, reusable components, local state, animations, TypeScript, and tests fit together.

## What This Demonstrates

- Expo app structure with `App.tsx` and `index.ts`.
- React Native primitives: `View`, `Text`, `FlatList`, `TextInput`, `Pressable`, `SafeAreaView`.
- A simple component system under `src/components`.
- Shared design tokens under `src/theme`.
- Pure domain logic under `src/domain`.
- Built-in React Native animation through `Animated`.
- A dependency-light setup that is easy to inspect.
- Unit tests for todo reducer logic.

## Getting Started

Install dependencies:

```bash
npm install
```

Start the Expo dev server:

```bash
npm run start
```

Then press:

- `i` to open iOS Simulator.
- `a` to open Android Emulator.
- Scan the QR code with Expo Go if you prefer a physical device.

Run tests:

```bash
npm run test
```

Type-check:

```bash
npm run typecheck
```

If `npm install` fails with a DNS error such as `EAI_AGAIN`, the project files are still valid, but your shell cannot reach the npm registry. Retry once network access is available.

## Project Structure

```text
.
├── App.tsx
├── index.ts
├── src
│   ├── components
│   │   ├── Pill.tsx
│   │   ├── ProgressRail.tsx
│   │   └── TodoRow.tsx
│   ├── domain
│   │   ├── todos.test.ts
│   │   └── todos.ts
│   └── theme
│       └── tokens.ts
├── app.json
├── package.json
└── tsconfig.json
```

## How To Read The Code

Start with `App.tsx`. It shows the main mobile screen, state management, filtering, task creation, and list rendering.

Then read:

- `src/domain/todos.ts` for reducer and selector logic.
- `src/theme/tokens.ts` for color, spacing, radius, and lane tokens.
- `src/components/TodoRow.tsx` for a reusable task row.
- `src/components/ProgressRail.tsx` for a small animated progress component.

## Why This Is Dependency-Light

The first goal is to understand Expo and React Native without fighting a large toolchain. In the larger TCG app, we would add libraries such as Expo Router, NativeWind, Reanimated, Gesture Handler, Skia, Rive, TanStack Query, and Supabase. This starter keeps the core concepts visible.

## Notes

This project does not use official Pokemon assets, logos, characters, card art, or trade dress. The UI is inspired by general TCG collector workflows: scanning, grading, trading, shipping, and collection progress.
