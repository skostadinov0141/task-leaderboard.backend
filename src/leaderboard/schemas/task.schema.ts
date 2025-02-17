import { Schema } from '@nestjs/mongoose';
import { ITask } from '../../core/interfaces/task.interface';
import { Leaderboard } from './leaderboard.schema';
import { Run } from './run.schema';

@Schema({ timestamps: true })
export class Task implements ITask {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  leaderboard: Leaderboard;
  title: string;
  description: string;
  rules: string[];
  runs: Run[];
  avgCompletionTime: number;
  baseReward: number;
}
