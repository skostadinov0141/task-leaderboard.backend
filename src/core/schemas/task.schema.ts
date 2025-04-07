import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Run } from './run.schema';

@Schema({ timestamps: true })
export class Task {
  _id: string;
  createdAt: Date;
  updatedAt: Date;

  @Prop()
  name: string;
  @Prop()
  description: string;
  @Prop()
  avgTime: number;
  @Prop()
  baseReward: number;
  @Prop()
  performanceMultiplier: number;
  @Prop()
  penaltyMultiplier: number;
  @Prop({ type: [mongoose.Types.ObjectId], ref: 'Run' })
  runs: Run[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
