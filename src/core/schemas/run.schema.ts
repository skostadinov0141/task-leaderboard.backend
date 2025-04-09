import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from './user.schema';

@Schema({ timestamps: { createdAt: 'startedAt', updatedAt: true } })
export class Run {
  _id: string;
  updatedAt: Date;
  startedAt: Date;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User' })
  user: User;
  @Prop({ isRequired: false })
  completionTime: number;
  @Prop({ isRequired: false })
  completedAt: Date;
}

export const RunSchema = SchemaFactory.createForClass(Run);
