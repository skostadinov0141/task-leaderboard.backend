import { IUser } from './user.interface';
import { ITask } from './task.interface';

export interface ILeaderboard {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  owner: IUser;
  admins: IUser[];
  users: IUser[];
  title: string;
  description: string;
  tasks: ITask[];
}
