import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { CreateLeaderboardDto } from './dtos/create-leaderboard.dto';
import { CreateTaskDto } from './dtos/create-task.dto';

@ApiBearerAuth()
@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Post()
  async createLeaderboard(
    @Req() request: Request,
    @Body() payload: CreateLeaderboardDto,
  ) {
    return this.leaderboardService.create(request['user'], payload);
  }

  @Get()
  async getLeaderboards() {
    return this.leaderboardService.findAll();
  }

  @Get(':id')
  async getLeaderboard(@Param('id') id: string) {
    return this.leaderboardService.findOneLeaderboard(id);
  }

  @Post(':id/task')
  async createTask(@Param('id') id: string, @Body() payload: CreateTaskDto) {
    return this.leaderboardService.createTask(id, payload);
  }

  @Post('task/:id/run/start')
  async startRun(@Param('id') id: string, @Req() request: Request) {
    return this.leaderboardService.startRun(request['user'], id);
  }

  @Post('task/run/:id/finish')
  async finishRun(@Param('id') id: string, @Req() request: Request) {
    return this.leaderboardService.endRun(id, request['user']);
  }
}
