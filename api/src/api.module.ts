import { Module } from '@nestjs/common';
import { MainModule } from '@api/main';

@Module({
  imports: [MainModule],
})
export class ApiModule {}
