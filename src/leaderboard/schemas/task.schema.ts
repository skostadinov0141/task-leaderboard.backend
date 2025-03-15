import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ITask } from '../../core/interfaces/task.interface';
import { Leaderboard } from './leaderboard.schema';
import { Run } from './run.schema';
import mongoose from 'mongoose';

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

  @Prop({ required: true, type: [mongoose.Types.ObjectId], ref: Run.name })
  runs: Run[];

  @Prop({ required: false })
  avgCompletionTime: number;

  @Prop({ required: false })
  baseReward: number;

  @Prop({ required: true })
  multiplier: number;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
