import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import 'reflect-metadata';

import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('CardQuestBootstrap');
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT ?? 3000);

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
    }),
  );

  logger.log('Global prefix enabled: /api');
  logger.log('CORS enabled for Expo/local development');
  logger.log(`Starting HTTP server on 0.0.0.0:${port}`);

  await app.listen(port, '0.0.0.0');

  const baseUrl = `${await app.getUrl()}/api`;
  logger.log(`CardQuest API listening at ${baseUrl}`);
  logger.log(`Health check: ${baseUrl}/health`);
  logger.log(`Mobile config: ${baseUrl}/mobile/config`);
}

void bootstrap().catch((error: unknown) => {
  if (error instanceof Error) {
    Logger.error(error.message, error.stack, 'CardQuestBootstrap');
  } else {
    Logger.error(String(error), undefined, 'CardQuestBootstrap');
  }

  process.exit(1);
});
