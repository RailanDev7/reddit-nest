import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { verifyUserId } from 'src/community/utils/functionsParams';
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

    return this.prisma.comment.create({
      data: {
        content: createCommentDto.content,
        postId: createCommentDto.postId,
        parentId: createCommentDto.parentId,
        userId
      }
    })
  }

  findAll() {
    return `This action returns all comments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
