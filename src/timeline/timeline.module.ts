import { Module } from '@nestjs/common';
import { TimelineService } from './timeline.service';
import { TimelineController } from './timeline.controller';
import { PrismaConfigModule } from 'src/prisma-config/prisma-config.module';

@Module({
  imports: [PrismaConfigModule],
  controllers: [TimelineController],
  providers: [TimelineService],
})
export class TimelineModule {}
