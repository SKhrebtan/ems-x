import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './shared/utils/exception-filter.util';
import { LoggerInterceptor } from './shared/interceptors/logger.interceptor';

async function bootstrap() {
  const { default: checkEnv, } = await import('./env')
  checkEnv()

  const app = await NestFactory.create<NestExpressApplication>(AppModule,)

  app.use(helmet());

  const frontendUrl = process.env['FRONTEND_URL']
  const allowedOrigins = [
    frontendUrl,
  ].filter((o): o is string => Boolean(o))

  app.enableCors({
    origin:         allowedOrigins,
    credentials:    true,
    exposedHeaders: ['Content-Disposition',],
  },)

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, },),)
  app.useGlobalFilters(new AllExceptionsFilter(),)
  app.useGlobalInterceptors(new LoggerInterceptor(),)

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Event Management System API',)
    .setDescription(
      'REST API for browsing, creating, editing, and recommending events. ' +
      'All endpoints are prefixed with /api.',
    )
    .setVersion('1.0',)
    .addTag('events', 'CRUD operations and similarity recommendations for events',)
    .build()
  const document = SwaggerModule.createDocument(app, swaggerConfig,)
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true, },
  },)

  const port = Number(process.env.PORT ?? 8080);
  await app.listen(port);
  Logger.log(`EMS API listening on http://localhost:${port}/api`, 'Bootstrap');
  Logger.log(`Swagger UI at http://localhost:${port}/api/docs`, 'Bootstrap');
}

bootstrap();
