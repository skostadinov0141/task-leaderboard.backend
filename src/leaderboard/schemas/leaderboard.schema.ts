import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ILeaderboard } from '../../core/interfaces/leaderboard.interface';
import { User } from '../../user/schemas/user.schema';
import { Task } from './task.schema';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Leaderboard implements ILeaderboard {
  _id: string;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ required: true, type: mongoose.Types.ObjectId, ref: User.name })
  owner: User;

  @Prop({ required: true, type: [mongoose.Types.ObjectId], ref: User.name })
  admins: User[];

  @Prop({ required: true, type: [mongoose.Types.ObjectId], ref: User.name })
  users: User[];

  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: true, type: [mongoose.Types.ObjectId], ref: Task.name })
  tasks: Task[];
}

export const LeaderboardSchema = SchemaFactory.createForClass(Leaderboard);
