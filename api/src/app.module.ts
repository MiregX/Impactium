import { Module } from '@nestjs/common';
import { ApiModule } from '@api/main';

@Module({
  imports: [ApiModule],
})
export class AppModule {}
