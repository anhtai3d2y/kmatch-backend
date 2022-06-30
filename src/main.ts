import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger:
      process.env.NODE_ENV === 'production'
        ? ['error', 'warn']
        : ['debug', 'error', 'log', 'verbose', 'warn'],
  });
  const config = new DocumentBuilder()
    .setTitle('Kmatch backend')
    .setDescription('The kmatch API ')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('verification')
    .addTag('user')
    .addTag('permission')
    .addTag('group-permission')
    .addTag('like-users')
    .addTag('dislike-users')
    .addTag('superlike-users')
    .addTag('superlike-star')
    .addTag('boots')
    .addTag('matches')
    .addTag('threads')
    .addTag('messages')
    .addTag('paypal')

    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const port = process.env.PORT;
  await app.listen(port);
}
bootstrap();
