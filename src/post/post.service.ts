import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaConfigService } from 'src/prisma-config/prisma-config.service';
import { verifyUserId } from 'src/utils/functionsParams';

@Injectable()
export class PostService {
  constructor(
      private prisma: PrismaConfigService) { }
  async create(createPostDto: CreatePostDto , userId: number) {
    verifyUserId(userId)
    const ifExistCommunity = await this.prisma.community.findUnique({
      where: {
        id: createPostDto.communityId
      }
    })
    if (!ifExistCommunity) {
      throw new NotFoundException('Community does not exist')
    }
    const post = await this.prisma.post.create({
      data: {
        title: createPostDto.title,
        content: createPostDto.content,
        image_url: createPostDto.image_url,
        video_url: createPostDto.video_url,

        user: {
          connect: {
            id: userId,
          },
        },

        community: {
          connect: {
            id: createPostDto.communityId,
          },
        },
      },

      select: {
        id: true,
        title: true,
        content: true,
        image_url: true,
        video_url: true,
        createdAt: true,

        user: {
          select: {
            id: true,

            profile: {
            select: {
              username: true,
              photo_url: true,
            },
          },
        },
      },

      community: {
        select: {
          id: true,
          name: true,
          image_url: true,
        },
      },

      _count: {
        select: {
          comment: true,
          postvote: true,
        },
      },
    },
  });

  return {
    id: post.id,
    title: post.title,
    content: post.content,

    image_url: post.image_url,
    video_url: post.video_url,

    createdAt: post.createdAt,

    author: {
      id: post.user.id,
      username: post.user.profile?.username,
      photo_url: post.user.profile?.photo_url,
    },

    community: {
      id: post.community.id,
      name: post.community.name,
      image_url: post.community.image_url,
    },

    counts: {
      comments: post._count.comment,
      votes: post._count.postvote,
    },
  };
}
  findAll() {
    return `This action returns all post`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
