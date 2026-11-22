import { INestApplication, ValidationPipe } from '@nestjs/common';

// Shared by main.ts and the tests, so app-wide config (pipes, filters)
// lives in one place.
export function configureApp(app: INestApplication) {
  // whitelist: strip properties not declared in the DTOs (e.g. id, createdAt).
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
}
