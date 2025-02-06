import { ILeaderboard } from './leaderboard.interface';

export interface ITask {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  leaderboard: ILeaderboard;
  title: string;
  description: string;
  rules: string[];
  runs: any[];
  avgCompletionTime: number;
  baseReward: number;
}
