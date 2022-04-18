import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  console.log('app is listening on the port 3000');
  await app.listen(process.env.PORT || 5000);
}
bootstrap();
