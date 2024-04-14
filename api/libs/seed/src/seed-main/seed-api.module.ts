import { Module } from '@nestjs/common';
import { PrismaModule } from '@api/main/prisma/prisma.module';
// import { <service> } from './<seed>/<service>';

@Module({
  imports: [PrismaModule],
  // providers: [<service>],
  // exports: [<service>],
})
export class SeedApiModule {}
