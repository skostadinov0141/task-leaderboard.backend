import { IUser } from './user.interface';

export interface ILeaderboard {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  owner: IUser;
  admins: IUser[];
  users: IUser[];
  title: string;
  description: string;
  tasks: any[];
}
