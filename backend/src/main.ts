import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS con configuración más permisiva
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  // Habilitar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Obtener el puerto de la configuración
  const configService = app.get(ConfigService);
  
  // Usar el puerto 3000 de forma consistente o el que se configure en variables de entorno
  const port = configService.get('PORT', 3000);
  
  await app.listen(port);
  
  console.log(`Aplicación iniciada exitosamente en puerto: ${port}`);
  console.log(`Aplicación iniciada en: ${await app.getUrl()}`);
}

bootstrap();