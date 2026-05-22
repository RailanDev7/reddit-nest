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

  @UseGuards(AuthGuard('jwt'))
  @Get('search')
  findAllNameCommunity(
    @Body() searchNames: any,
    @Request() req,
    @Query('page') page: string,
    @Query('name') names: string) {
    const userId = req.user.id
    console.log(names)
    return this.communityService.findAllNames(userId, names, Number(page) || 1);
  }

  @Get('search/all')
  findAll() {
   return this.communityService.searchCommunity();
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
