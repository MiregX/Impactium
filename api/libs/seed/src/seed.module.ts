import { Module } from '@nestjs/common';
import { SeedApiModule } from './seed-main/seed-api.module';
// import { <service> } from './seed-main/<seedname>/<seedname>.service';

@Module({
  imports: [SeedApiModule],
})
export class SeedModule {
  constructor(
    // private readonly <service>: <service>,
  ) {}

  async runSeeders() {
    // this.<service>.seed();
  }
}
