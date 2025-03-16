import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Task Leaderboard API')
    .setVersion('0.0.1')
    .addBearerAuth({
      type: 'http',
      flows: {
        password: {
          tokenUrl: '/user/login',
          refreshUrl: '/user/refresh',
          scopes: ['read', 'write'],
        },
      },
    })
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory, {
    jsonDocumentUrl: '/swagger/json',
  });

  app.enableCors({
    origin: ['http://localhost:3000'],
  });

  await app.listen(3001);
}
bootstrap();
