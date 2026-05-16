# CardQuest API

Simple NestJS backend for the Expo React Native app. It uses in-memory data so the mobile app has a clear API contract to follow before adding a real database.

## Run

```sh
npm install
npm run start:dev
```

The API listens on `http://localhost:3000/api` by default.

## Check Logs

Run the API and watch the terminal:

```sh
npm run api:dev
```

You should see startup logs with the health and mobile config URLs. Every request also logs an incoming and completed line:

```txt
[RequestLoggerMiddleware] [a1b2c3d4] -> GET /api/health from 127.0.0.1
[RequestLoggerMiddleware] [a1b2c3d4] <- GET /api/health 200 4ms 74b
```

Trigger a quick check:

```sh
curl http://localhost:3000/api/health
```

For a physical phone in Expo Go, use your computer's LAN IP instead of `localhost`, for example:

```sh
EXPO_PUBLIC_API_URL=http://<YOUR_COMPUTER_LAN_IP>:3000/api
```

## Endpoints

- `GET /api/health`
- `GET /api/mobile/config`
- `GET /api/todos?filter=all|open|done&lane=scan|grade|trade|ship`
- `POST /api/todos`
- `PATCH /api/todos/:id/toggle`
- `DELETE /api/todos/:id`
- `DELETE /api/todos/completed`
- `GET /api/scans/guidance`
- `GET /api/scans`
- `POST /api/scans`

## Expo Fetch Example

```ts
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api';

export async function getTodos() {
  const response = await fetch(`${API_URL}/todos`);
  return response.json();
}

export async function createScan(imageUri: string) {
  const response = await fetch(`${API_URL}/scans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageUri }),
  });

  return response.json();
}
```
