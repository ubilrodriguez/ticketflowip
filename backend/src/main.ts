import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  // Habilitar CORS con configuración específica
app.enableCors({
  origin: 'http://localhost:5173', // URL de su aplicación React/Vite
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
});
  // Configurar prefijo global para la API
  app.setGlobalPrefix('api');

  // Configurar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('TicketFlow API')
    .setDescription('API para sistema de gestión de tickets de soporte')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Intentar con puertos aleatorios en un rango alto
  const startPort = 8000;
  const endPort = 9999;
  
  let currentPort = startPort;
  let success = false;
  
  while (currentPort <= endPort && !success) {
    try {
      await app.listen(currentPort);
      console.log(`Aplicación iniciada exitosamente en puerto: ${currentPort}`);
      success = true;
    } catch (error) {
      console.log(`Puerto ${currentPort} en uso, intentando con otro...`);
      // Generamos un salto más grande para evitar rangos ocupados
      currentPort += Math.floor(Math.random() * 100) + 50;
    }
  }

  if (!success) {
    console.error('No se pudo encontrar un puerto disponible entre 8000-9999');
    process.exit(1);
  }

  console.log(`Aplicación iniciada en: ${await app.getUrl()}`);
}
bootstrap();