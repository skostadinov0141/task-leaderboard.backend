import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Leaderboard } from './schemas/leaderboard.schema';
import { Model } from 'mongoose';
import { Task } from './schemas/task.schema';
import { Run } from './schemas/run.schema';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectModel(Leaderboard.name)
    private readonly leaderboardModel: Model<Leaderboard>,
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
    @InjectModel(Run.name)
    private readonly runModel: Model<Run>,
  ) {}
}
