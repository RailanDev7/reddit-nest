import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Search } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { verifyUserId } from 'src/utils/functionsParams';
import { PrismaConfigService } from 'src/prisma-config/prisma-config.service';

@Injectable()
export class CommentsService {
  constructor(
    private prisma: PrismaConfigService,
  ) { }
  async create(userId: number, createCommentDto: CreateCommentDto) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: createCommentDto.postId
      }
    })

    if (!post || post.deletedAt) {
      throw new NotFoundException(
        'Post não encontrado'
      )
    }

    if (createCommentDto.parentId != null) {

      const parentComment =
        await this.prisma.comment.findFirst({
          where: {
            id: createCommentDto.parentId,
            deletedAt: null,
            postId: createCommentDto.postId
          }
        })

      if (!parentComment) {
        throw new BadRequestException(
          'Comentário inválido'
        )
      }
    }

  await this.prisma.comment.create({
      data: {
        content: createCommentDto.content,
        postId: createCommentDto.postId,
        parentId: createCommentDto.parentId,
        userId: userId
      }
    })
    return {status: "success"}
  }

  async findAll(userId, postId) {
    verifyUserId(userId)
    const result = await this.prisma.post.findFirst({
      where: {
        id: postId,
        userId: userId
      }
    })
    return result
  }
async update(
  userId: number,
  id: number,
  updateCommentDto: UpdateCommentDto,
) {
  verifyUserId(userId);

  const comment = await this.prisma.comment.findUnique({
    where: {
      id,
    },
    select: {
      userId: true,
    },
  });

  if (!comment) {
    throw new NotFoundException('Comment not exist');
  }

  if (comment.userId !== userId) {
    throw new ForbiddenException(
      'You do not have permission to edit this comment',
    );
  }

  return this.prisma.comment.update({
    where: {
      id,
    },
    data: {
      content: updateCommentDto.content,
    },
  });
}
  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
