import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IRun } from '../../core/interfaces/run.interface';
import { User } from '../../user/schemas/user.schema';
import mongoose from 'mongoose';
import { Task } from './task.schema';

@Schema({ timestamps: true })
export class Run implements IRun {
  _id: string;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({ required: false })
  duration?: number;

  @Prop({ required: false })
  finalReward: number;

  @Prop({ required: true, type: mongoose.Types.ObjectId, ref: User.name })
  user: User;

  @Prop({ required: true, type: mongoose.Types.ObjectId, ref: Task.name })
  task: Task;
}

export const RunSchema = SchemaFactory.createForClass(Run);
