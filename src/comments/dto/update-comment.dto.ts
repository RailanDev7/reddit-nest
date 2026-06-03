import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';
import { IsString, Length } from 'class-validator';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
    @IsString()
    @Length(1, 5000)
    content!: string;
}
