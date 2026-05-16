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



  //update profile
  async update(
    userId: number,
    dates: UpdateProfileDto,
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

    if (!profileExist) {
      throw new NotFoundException(
        'Profile does not exist',
      );
    }
     const photo = files?.photo?.[0];
    const banner = files?.banner?.[0];

    let photoPath: string | null = null;
    let bannerPath: string | null = null;

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
    await this.prisma.profile.update({
      where: {
        userId: userId
      }, data: {
        bio: dates.bio,
        photo_url: photoPath,
        banner_url: bannerPath

      }
    })
     return {
    success: true,
    message: 'Data updated successfully',
  };
  }

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
    const baseUrl = 'http://localhost:3000'
    return {
      username: userProfile?.username,
      photo_url: `${baseUrl}${userProfile?.photo_url}`,
      banner_url: `${baseUrl}${userProfile?.banner_url}`,
      bio: userProfile?.bio
    }
  }

  async findByUsername(userId: number, username: string, page: number = 1) {
    const limit = 20
    if (!userId) {
      throw new BadRequestException(
        'UserId is required',
      );
    }
    return await this.prisma.profile.findMany({
      where: {
        username: {
          startsWith: username
        }
      },
      select: {
        id: true,
        username: true,
        photo_url: true,
        createdAt: true

      },
      take: limit,
      skip: (page - 1) * limit
    })
  }
}