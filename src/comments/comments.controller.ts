import { Controller, Get, Post,Request, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/v1/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  create(@Request() req, @Body() createCommentDto: CreateCommentDto) {
    const userId = req.user.id
    console.log(userId)
    return this.commentsService.create(userId, createCommentDto);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('search/:id')
  findAll(@Request() req,  @Param('id') postId: string) {
    const userId = req.user.id
    console.log(userId, postId)
    return this.commentsService.findAll(userId, Number(postId));
  }
//update comments
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto, @Request() req) {
    const userId = req.user.id
    return this.commentsService.update(userId, +id, updateCommentDto);

  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }
}
