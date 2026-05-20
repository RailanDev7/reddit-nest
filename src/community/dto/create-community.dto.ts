import {
    IsInt,
    IsOptional,
    IsString,
    IsUrl,
    MaxLength,
    MinLength,
} from 'class-validator';



export class CreateCommunityDto {
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    name!: string;

    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    slog!: string;
    @IsOptional()


    @IsOptional()
    @IsString()
    @IsUrl()
    @MaxLength(500)
    image_url?: string;

    @IsString()
    @MinLength(3)
    @MaxLength(30)
    bio!: string;

}
