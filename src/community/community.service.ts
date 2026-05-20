import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { PrismaConfigService } from 'src/prisma-config/prisma-config.service';
import { verifyUserId } from './utils/functionsParams';

@Injectable()
export class CommunityService {
  constructor(
      private prisma: PrismaConfigService,
    ) {}
  async create(
    userId: number,
    createCommunityDto: CreateCommunityDto,
    ) {
     verifyUserId(userId)
     const community = await this.prisma.community.create({
      data: {
        name: createCommunityDto.name,
        slug: createCommunityDto.slog,
        image_url: createCommunityDto.image_url,
        bio: createCommunityDto.bio,
        creatorId: userId,
        members: {
          create: {
            userId,
            role: "ADMIN"
          }
        }
      },
      include: {
        members: true
      }
     })
     return community
     
  }

  async findAllNames(userId: number, searchNames: any, page: any) {
    verifyUserId(userId)
    const limit = 10
    const searchNamesResult = await this.prisma.community.findMany({
      where: {
        name: {
          startsWith: searchNames,

        }
      },
      select: {
        name: true
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        name: 'asc'
      }
    }) 
    return searchNamesResult
  } 

  findOne(id: number) {
    return `This action returns a #${id} community`;
  }

  update(id: number, updateCommunityDto: UpdateCommunityDto) {
    return `This action updates a #${id} community`;
  }

  remove(id: number) {
    return `This action removes a #${id} community`;
  }
}
