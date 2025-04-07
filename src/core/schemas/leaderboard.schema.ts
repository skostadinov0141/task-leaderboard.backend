import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from './user.schema';
import { Task } from './task.schema';

@Schema({ timestamps: true })
export class Leaderboard {
  _id: string;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User' })
  owner: User;
  @Prop()
  users: LeaderboardUser[];
  @Prop({ type: mongoose.Types.ObjectId, ref: 'Task' })
  tasks: Task[];
}

export class LeaderboardUser {
  @Prop({ type: mongoose.Types.ObjectId, ref: 'User' })
  user: User;
  @Prop()
  role: ELeaderboardUserRole;
}

export enum ELeaderboardUserRole {}

export const LeaderboardSchema = SchemaFactory.createForClass(Leaderboard);
