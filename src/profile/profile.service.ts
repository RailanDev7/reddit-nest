import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

import { PrismaConfigService } from '../prisma-config/prisma-config.service';

import * as fs from 'fs';
import * as path from 'path';

import { randomUUID } from 'crypto';
import { response } from 'express';

@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaConfigService,
  ) {}

  async create(
    dates: CreateProfileDto,
    userId: number,
    files: any,
  ) {
    if (!userId) {
      throw new BadRequestException(
        'UserId is required',
      );
    }

    const profileExist =
      await this.prisma.profile.findUnique({
        where: {
          userId,
        },
      });

    if (profileExist) {
      throw new ConflictException(
        'Profile already exists',
      );
    }

    const usernameExist =
      await this.prisma.profile.findUnique({
        where: {
          username: dates.username,
        },
      });

    if (usernameExist) {
      throw new ConflictException(
        'Username already being used',
      );
    }

    const photo = files?.photo?.[0];
    const banner = files?.banner?.[0];

    let photoPath: string | null = null;
    let bannerPath: string | null = null;

    // salva foto manualmente
    if (photo) {
      const photoName = `${randomUUID()}-${
        photo.originalname
      }`;

      fs.writeFileSync(
        path.join(
          process.cwd(),
          'uploads',
          photoName,
        ),
        photo.buffer,
      );

      photoPath = `/uploads/${photoName}`;
    }

    // salva banner manualmente
    if (banner) {
      const bannerName = `${randomUUID()}-${
        banner.originalname
      }`;

      fs.writeFileSync(
        path.join(
          process.cwd(),
          'uploads',
          bannerName,
        ),
        banner.buffer,
      );

      bannerPath = `/uploads/${bannerName}`;
    }

    const profile =
      await this.prisma.profile.create({
        data: {
          bio: dates.bio,
          username: dates.username,
          userId,

          photo_url: photoPath,
          banner_url: bannerPath,
        },
      });

    return profile;
  }

  async findAll() {}

  async findOne(id: number) {}

  async update(
    id: number,
    updateProfileDto: UpdateProfileDto,
  ) {}

  async remove(id: number) {}


  //search profile
  async findByProfile(userId: number) {
    console.log(userId)
     if (!userId) {
      throw new BadRequestException(
        'UserId is required',
      );
    }

    const profileExist =
      await this.prisma.profile.findUnique({
        where: {
          userId,
        },
      });

    if (!profileExist) {
      throw new NotFoundException(
        'Profile does not exist',
      );
    }
    const userProfile = await this.prisma.profile.findUnique({
      where: {
        userId
      }
      
    })
    return {
      username: userProfile?.username,
      photo_url: userProfile?.photo_url,
      banner_url: userProfile?.banner_url,
      bio: userProfile?.bio
    }
  }

  async findByUsername(username: string) {}
}