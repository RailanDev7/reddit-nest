import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { PrismaConfigModule } from 'src/prisma-config/prisma-config.module';

@Module({
  imports: [PrismaConfigModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
