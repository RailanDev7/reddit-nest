import { Controller, Get, Post, Body, Request, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/v1/profile')
export class ProfileController {
  authService: any;
  constructor(private readonly profileService: ProfileService) {}

   @UseGuards(AuthGuard('jwt'))
    //criar perfil
    @Post('create')
    async createProfile(
      @Body() body: any
    ) { 
      
      
    }
    //sobre meu perfil
    @Get('me')
    async profileMe() {
      return null
    }
  

  @Patch('update')
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(+id, updateProfileDto);
  }

  @Delete('delete')
  remove(@Param('id') id: string) {
    return this.profileService.remove(+id);
  }
}
