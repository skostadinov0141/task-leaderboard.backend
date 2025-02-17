import { Schema } from '@nestjs/mongoose';
import { ILeaderboard } from '../../core/interfaces/leaderboard.interface';
import { User } from '../../user/schemas/user.schema';
import { Task } from './task.schema';

@Schema({ timestamps: true })
export class Leaderboard implements ILeaderboard {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  owner: User;
  admins: User[];
  users: User[];
  title: string;
  description: string;
  tasks: Task[];
}
