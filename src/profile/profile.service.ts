import { ConflictException, HttpCode, HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaConfigService } from '../prisma-config/prisma-config.service';

@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaConfigService
  ) { }
  async create(dates: CreateProfileDto, userId: number, files: any) {
    if (!userId) {
      message: "UserId is required."
    }
    const profileExist = await this.prisma.profile.findUnique({
      where: {
        userId: userId
      }
    })
    if (profileExist) {
      throw new ConflictException('Profile already exists');
    }

    const photo = files?.photo?.[0];
    const banner = files?.banner?.[0];
    const profile = await this.prisma.profile.create({
      data: {
        bio: dates.bio,
        username: dates.username,
        userId,

        photo_url: photo
          ? `/uploads/${photo.filename}`
          : null,

        banner_url: banner
          ? `/uploads/${banner.filename}`
          : null,
      },
    });

    return profile;
  }
  async findAll() {
   
  }

  async findOne(id: number) {
   
      
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    
  }

  async remove(id: number) {
    
  }

  async findByUserId(userId: number) {
   
  }

  async findByUsername(username: string) {
   
  }
}
