import { NestFactory } from '@nestjs/core';
import { SeedModule } from './src/seed.module';

export async function seed() {
  const api = await NestFactory.createApplicationContext(SeedModule);
  const seedModule = api.get(SeedModule);
  await seedModule.seed();
  await api.close();
}

seed()
  .then(() => console.log('Seed complete!'))
  .catch((error) => {
    console.error('Seeding failed!', error);
    process.exit(1);
  });
