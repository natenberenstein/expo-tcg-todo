import { MiddlewareConsumer, Module, type NestModule } from '@nestjs/common';

import { AppController } from './app.controller';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';
import { ScansModule } from './scans/scans.module';
import { TodosModule } from './todos/todos.module';

@Module({
  controllers: [AppController],
  imports: [TodosModule, ScansModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('{*path}');
  }
}
