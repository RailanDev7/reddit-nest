import { Module } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CommunityController } from './community.controller';
import { PrismaConfigModule } from 'src/prisma-config/prisma-config.module';

@Module({
  imports: [PrismaConfigModule],
  controllers: [CommunityController],
  providers: [CommunityService],
})
export class CommunityModule {}
