import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaConfigModule } from 'src/prisma-config/prisma-config.module';

@Module({
  imports: [PrismaConfigModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
