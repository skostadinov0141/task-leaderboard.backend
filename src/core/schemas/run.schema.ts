import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from './user.schema';

@Schema({ timestamps: true })
export class Run {
  _id: string;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User' })
  user: User;
  @Prop()
  completionTime: number;
  @Prop()
  startedAt: Date;
  @Prop()
  completedAt: Date;
}

export const RunSchema = SchemaFactory.createForClass(Run);
