import { Controller, Get, Post, Body, Patch, Param, Delete , Request, UseGuards, Query} from '@nestjs/common';
import { CommunityService } from './community.service';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/v1/community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

   @UseGuards(AuthGuard('jwt'))
  @Post('create')
  create(@Body() createCommunityDto: CreateCommunityDto, @Request() req) {
    const userId = req.user.id
    return this.communityService.create(userId, createCommunityDto);
  }

  @Get('search')
  findAllNameCommunity(@Body() searchNames: any,  @Request() req, @Query('page') page: string) {
    const userId = req.user.id
    return this.communityService.findAllNames(userId,searchNames, Number(page) || 1);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.communityService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommunityDto: UpdateCommunityDto) {
    return this.communityService.update(+id, updateCommunityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.communityService.remove(+id);
  }
}
