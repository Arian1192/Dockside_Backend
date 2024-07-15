import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

const environment = process.env.NODE_ENV || 'development';
dotenv.config({
  path: `.${environment}.env`,
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');
  await app.listen(port || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
