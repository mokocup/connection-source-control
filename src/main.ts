import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Schema Importer API')
    .setDescription(
      'API for managing database source connections and retrieving schema information',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); //  Endpoint for Swagger UI
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
