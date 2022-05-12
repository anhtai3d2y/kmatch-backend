import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Kmatch backend')
    .setDescription('The kmatch API ')
    .setVersion('1.0')
    .addTag('hello world')
    .addTag('auth')
    .addTag('adminUser')
    .addTag('role')
    .addTag('permission')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const port = process.env.PORT;
  await app.listen(port);
  console.log(`Application listening on port ${port}`);
}
bootstrap();
