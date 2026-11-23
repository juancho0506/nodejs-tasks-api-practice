import { INestApplication, ValidationPipe } from '@nestjs/common';

export function configureApp(app: INestApplication) {
  // whitelist strips unknown fields (id, createdAt) from request bodies
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
}
