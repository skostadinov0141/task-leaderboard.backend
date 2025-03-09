import { ILeaderboard } from './leaderboard.interface';
import { IRun } from './run.interface';

export interface ITask {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  leaderboard: ILeaderboard;
  title: string;
  description: string;
  rules: string[];
  runs: IRun[];
  avgCompletionTime: number;
  baseReward: number;
  multiplier: number;
}
