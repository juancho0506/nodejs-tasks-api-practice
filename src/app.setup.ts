import { INestApplication } from '@nestjs/common';

// Shared by main.ts and the tests, so app-wide config (pipes, filters)
// lives in one place.
export function configureApp(app: INestApplication) {
  // nothing configured yet
}
