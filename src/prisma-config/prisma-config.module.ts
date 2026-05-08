import { Module } from '@nestjs/common';
import { PrismaConfigService } from './prisma-config.service';

@Module({
  providers: [PrismaConfigService],
  exports: [PrismaConfigService]
})
export class PrismaConfigModule {}
