import {
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProfileDto {
    
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  bio?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  @MaxLength(500)
  photo_url?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  @MaxLength(500)
  banner_url?: string;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  username!: string;

  @IsInt()
  userId!: number;
}
