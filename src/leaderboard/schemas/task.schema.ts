import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ITask } from '../../core/interfaces/task.interface';
import { Leaderboard } from './leaderboard.schema';
import { Run } from './run.schema';
import mongoose from 'mongoose';
import { User } from '../../user/schemas/user.schema';

@Schema({ timestamps: true })
export class Task implements ITask {
  _id: string;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ required: true, type: mongoose.Types.ObjectId, ref: Task.name })
  leaderboard: Leaderboard;

  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: true })
  rules: string[];

  @Prop({ required: true, type: [mongoose.Types.ObjectId], ref: User.name })
  runs: Run[];

  @Prop({ required: false })
  avgCompletionTime: number = 0;

  @Prop({ required: false })
  baseReward: number;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
