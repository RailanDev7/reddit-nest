import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';

import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

import { AuthGuard } from '@nestjs/passport';

import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter } from './formatters/icons.formatters';
import { memoryStorage } from 'multer';

@Controller('api/v1/profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
  ) {}

  //search profile
  @UseGuards(AuthGuard('jwt'))
  @Get('user/me')
  async getMyProfile(@Request() req) {
    const userId = req.user.id;
    console.log(userId)
    return this.profileService.findByProfile(userId);
  }


  //creating profile
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(
  FileFieldsInterceptor(
    [
      {
        name: 'photo',
        maxCount: 1,
      },
      {
        name: 'banner',
        maxCount: 1,
      },
    ],
    {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: imageFileFilter,
    },
  ),
)
@Post('create')
async createProfile(
  @Body() createProfileDto: CreateProfileDto,
  @Request() req,
  @UploadedFiles() files: any,
) {

  const userId = req.user.id;

  return this.profileService.create(
   createProfileDto,
    userId,
    files
  );
}
  @UseGuards(AuthGuard('jwt'))
  @Patch('update')
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {

    const userId = req.user.id;

    return this.profileService.update(
      userId,
      updateProfileDto,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete')
  async deleteProfile(@Request() req) {

    const userId = req.user.id;

  }
}