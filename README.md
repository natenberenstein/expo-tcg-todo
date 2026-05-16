# CardQuest Todo

A small Expo + React Native todo app that demonstrates a TCG-inspired mobile workflow. It uses a collector-themed task board backed by a local NestJS API so React Native screens, reusable components, API calls, backend mutations, TypeScript, and tests fit together.

## What This Demonstrates

- Expo app structure with `App.tsx` and `index.ts`.
- React Native primitives such as `View`, `Text`, `FlatList`, `TextInput`, `Pressable`, and `SafeAreaView`.
- Reusable UI components under `src/components`.
- A typed mobile API client under `src/api`.
- A NestJS backend under `backend`.
- Shared design tokens under `src/theme`.
- Pure todo selector logic under `src/domain`.
- Built-in React Native animation through `Animated`.
- A dependency-light setup that is easy to inspect.
- Unit tests for todo domain logic.

## Current Stack

Use Node.js 20.19 or newer.

This repo is pinned to the Expo SDK 54 dependency set:

- Expo `~54.0.0`
- React `19.1.0`
- React Native `0.81.5`
- NestJS `^11.1.6`
- TypeScript `~5.9.2`
- Vitest `^3.2.4`

## Getting Started

Install dependencies:

```bash
npm install
npm install --prefix backend
```

Start the backend in one terminal:

```bash
npm run api:dev
```

The API listens on `http://localhost:3000/api` by default.

Start the Expo dev server in another terminal with an explicit API URL:

```bash
EXPO_PUBLIC_API_URL=http://localhost:3000/api npm run start
```

The mobile app reads `EXPO_PUBLIC_API_URL` at startup. Set it every time you start Expo so the running app points at the correct backend for your target device.

Use the URL that matches where the app is running:

```bash
# Expo web or iOS Simulator on the same computer
EXPO_PUBLIC_API_URL=http://localhost:3000/api npm run start

# Android Emulator
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000/api npm run start

# Physical phone in Expo Go
EXPO_PUBLIC_API_URL=http://<YOUR_COMPUTER_LAN_IP>:3000/api npm run start
```

For a physical phone, replace `<YOUR_COMPUTER_LAN_IP>` with the LAN IP of the computer running `npm run api:dev`. The phone and computer must be on the same network, and the backend port `3000` must be reachable.

Then press:

- `i` to open iOS Simulator.
- `a` to open Android Emulator.
- `w` to open the web build.
- Scan the QR code with Expo Go if you prefer a physical device.

You can also launch a target directly:

```bash
npm run ios
npm run android
npm run web
```

## Scripts

```bash
npm run start      # Start Expo
npm run ios        # Start Expo and open iOS
npm run android    # Start Expo and open Android
npm run api:dev    # Start the NestJS API
npm run api:typecheck # Run backend TypeScript without emitting files
npm run web        # Start Expo and open web
npm run test       # Run unit tests
npm run typecheck  # Run TypeScript without emitting files
```

## Troubleshooting

If `npm install` fails with a DNS error such as `EAI_AGAIN`, the project files are still valid, but your shell cannot reach the npm registry. Retry once network access is available.

If `npm install` fails with an `ERESOLVE` peer dependency conflict, confirm that `package.json` uses the Expo SDK 54-compatible React and React Native versions listed above.

## Project Structure

```text
.
|-- App.tsx
|-- backend
|   `-- src
|       |-- scans
|       `-- todos
|-- index.ts
|-- src
|   |-- api
|   |   `-- cardquest.ts
|   |-- components
|   |   |-- Pill.tsx
|   |   |-- ProgressRail.tsx
|   |   `-- TodoRow.tsx
|   |-- domain
|   |   |-- todos.test.ts
|   |   `-- todos.ts
|   `-- theme
|       `-- tokens.ts
|-- app.json
|-- package-lock.json
|-- package.json
`-- tsconfig.json
```

## How To Read The Code

Start with `App.tsx`. It shows the main mobile screen, API-backed state management, filtering, task creation, scan creation, and list rendering.

Then read:

- `src/api/cardquest.ts` for the mobile fetch client.
- `backend/src/todos` and `backend/src/scans` for API endpoints.
- `src/domain/todos.ts` for todo types and selector logic.
- `src/theme/tokens.ts` for color, spacing, radius, and lane tokens.
- `src/components/Pill.tsx` for the compact status and filter control.
- `src/components/TodoRow.tsx` for a reusable task row.
- `src/components/ProgressRail.tsx` for a small animated progress component.

## Concept Notes

- [Competitor Analysis](docs/tcg-app-concept/competitor-analysis.md) captures the competitive landscape for the larger TCG app concept, including marketplaces, scanner apps, portfolio trackers, grading/vaulting platforms, and live-commerce competitors.

## Why This Is Dependency-Light

The first goal is to understand Expo and React Native without fighting a large toolchain. In the larger TCG app, we would add libraries such as Expo Router, NativeWind, Reanimated, Gesture Handler, Skia, Rive, TanStack Query, and Supabase. This starter keeps the core concepts visible.

## Notes

This project does not use official Pokemon assets, logos, characters, card art, or trade dress. The UI is inspired by general TCG collector workflows: scanning, grading, trading, shipping, and collection progress.
