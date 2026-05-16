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
  Query,
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


//update profile infos
  @Patch('user/update')
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  @UploadedFiles() files: any,
  ) {

    const userId = req.user.id;
    return this.profileService.update(
      userId,
      updateProfileDto,
      files
    );
  }

//search user profile

@UseGuards(AuthGuard('jwt'))
@Get('user/search')
async searchProfile(
  @Query('username') username: string,
  @Query('page') page: string,
  @Request() req,) {
  const userId = req.user.id;
  return this.profileService.findByUsername(userId, username, Number(page) || 1)
}

@UseGuards(AuthGuard('jwt'))
@Get('user/search/:id')
async findProfileId(
  @Request() req, @Param('id') id: string) {
   const userId = req.user.id;
  return this.profileService.findOneProfile(userId, Number(id))
}

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete')
  async deleteProfile(@Request() req, ) {
    const userId = req.user.id;
    
  }
}