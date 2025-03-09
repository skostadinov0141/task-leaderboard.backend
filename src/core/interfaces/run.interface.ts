import { IUser } from './user.interface';
import { ITask } from './task.interface';

export interface IRun {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  endTime: Date;
  duration?: number;
  finalReward: number;
  user: IUser;
  task: ITask;
}
