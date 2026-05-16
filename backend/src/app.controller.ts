import { Controller, Get } from '@nestjs/common';

import { scanGuidance } from './scans/scan-guidance';
import { taskLanes } from './todos/todo.types';

@Controller()
export class AppController {
  @Get('health')
  health() {
    return {
      ok: true,
      service: 'cardquest-api',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('mobile/config')
  mobileConfig() {
    return {
      apiVersion: 'v1',
      endpoints: {
        scans: '/api/scans',
        scanGuidance: '/api/scans/guidance',
        todos: '/api/todos',
      },
      scanGuidance,
      taskLanes,
    };
  }
}
