import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator'

export class CreateCommentDto {

  @IsString()
  @MinLength(1)
  @MaxLength(100000)
  content!: string

  @IsInt()
  postId!: number

  @IsOptional()
  @IsInt()
  parentId?: number
}