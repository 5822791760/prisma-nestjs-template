import { INestApplication, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { patchNestJsSwagger } from 'nestjs-zod';

export function setupApp(app: INestApplication): void {
  // Set versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });
}

export function setupSwagger(app: INestApplication) {
  patchNestJsSwagger();

  const config = new DocumentBuilder()
    .setTitle('DW API')
    .setDescription('DW API description')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs/swagger', app, document);
}
