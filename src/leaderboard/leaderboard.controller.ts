import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { CreateLeaderboardDto } from './dtos/create-leaderboard.dto';
import { CreateTaskDto } from './dtos/create-task.dto';
import { Run } from './schemas/run.schema';
import { Task } from './schemas/task.schema';
import { Leaderboard } from './schemas/leaderboard.schema';
import { UpdateLeaderboardDto } from './dtos/update-leaderboard.dto';

@ApiBearerAuth()
@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Post()
  async createLeaderboard(
    @Req() request: Request,
    @Body() payload: CreateLeaderboardDto,
  ): Promise<Leaderboard> {
    return this.leaderboardService.create(request['user'], payload);
  }

  @Get()
  async getLeaderboards(): Promise<Leaderboard[]> {
    return this.leaderboardService.findAll();
  }

  @Get(':id')
  async getLeaderboard(@Param('id') id: string): Promise<Leaderboard> {
    return this.leaderboardService.findOneLeaderboard(id);
  }

  @Put(':id')
  async updateLeaderboard(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() payload: UpdateLeaderboardDto,
  ): Promise<Leaderboard> {
    return this.leaderboardService.update(id, payload, request['user']);
  }

  @Put(':id/addAdmin')
  async addAdmin(
    @Param('id') id: string,
    @Req() request: Request,
    @Query() adminId: string,
  ): Promise<Leaderboard> {
    return this.leaderboardService.addAdmin(id, request['user'], adminId);
  }

  @Put(':id/removeAdmin')
  async removeAdmin(
    @Param('id') id: string,
    @Req() request: Request,
    @Query() adminId: string,
  ): Promise<Leaderboard> {
    return this.leaderboardService.removeAdmin(id, request['user'], adminId);
  }

  @Post(':id/task')
  async createTask(
    @Param('id') id: string,
    @Body() payload: CreateTaskDto,
  ): Promise<Task> {
    return this.leaderboardService.createTask(id, payload);
  }

  @Get('task/:id')
  async getTask(@Param('id') id: string): Promise<Task> {
    return this.leaderboardService.findOneTask(id);
  }

  @Post('task/:id/run/start')
  async startRun(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<Run> {
    return this.leaderboardService.startRun(request['user'], id);
  }

  @Post('task/run/:id/finish')
  async finishRun(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<Run> {
    return this.leaderboardService.endRun(id, request['user']);
  }
}
