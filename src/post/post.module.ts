import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaConfigModule } from 'src/prisma-config/prisma-config.module';

@Module({
  imports: [PrismaConfigModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
