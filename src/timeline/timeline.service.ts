import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTimelineDto } from './dto/create-timeline.dto';
import { UpdateTimelineDto } from './dto/update-timeline.dto';
import { PrismaConfigService } from 'src/prisma-config/prisma-config.service';
import { cursorTo } from 'readline';
;

@Injectable()
export class TimelineService {
  constructor(
    private prisma: PrismaConfigService) { }
  async create(createPostDto: CreateTimelineDto, userId: number) {

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
  //feed
async findFeed(cursor: number, userId: number) {
  const posts = await this.prisma.post.findMany({
    take: 20,
    skip: cursor ? 1 : 0,
    cursor: cursor ? {id: cursor } : undefined,
     orderBy: {
      id: 'desc',
    },

    where: {
      deletedAt: null,
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
      postvote: {
        where: {
          userId: userId
        },
        select: {
          type: true
        }
      },
      comment: {
        take: 2,
        orderBy: {
          createdAt: 'desc'
        }
      },

      _count: {
        select: {
          comment: true,
          postvote: true,
        },
      },
    },
  });

  const nextCursor = posts.length > 0 ? posts[posts.length -1].id
  : null
  const formattedPosts = posts.map(post => ({
    ...post,
    uservote: post.postvote[0]?.type || null
  }))
  return {
    posts: posts,
    nextCursor
  };
}
  findOne(id: number) {
    return `This action returns a #${id} timeline`;
  }

  update(id: number, updateTimelineDto: UpdateTimelineDto) {
    return `This action updates a #${id} timeline`;
  }

  remove(id: number) {
    return `This action removes a #${id} timeline`;
  }
}
