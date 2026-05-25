import { Controller, Get, UseGuards, Post, Request, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TimelineService } from './timeline.service';
import { CreateTimelineDto } from './dto/create-timeline.dto';
import { UpdateTimelineDto } from './dto/update-timeline.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/v1/home')
export class TimelineController {
  constructor(private readonly timelineService: TimelineService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create/post')
  create(@Body() createTimelineDto: CreateTimelineDto, @Request() req) {
    const userId = req.user.id
    return this.timelineService.create(createTimelineDto, userId);
  }


  //timeline
  @UseGuards(AuthGuard('jwt'))
  @Get("feed")
  timeLine(@Request() req,
 @Query('cursor') cursor?: string) {
    const userId = req.user.id
    return this.timelineService.findFeed(Number(cursor), userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.timelineService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTimelineDto: UpdateTimelineDto) {
    return this.timelineService.update(+id, updateTimelineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timelineService.remove(+id);
  }
}
