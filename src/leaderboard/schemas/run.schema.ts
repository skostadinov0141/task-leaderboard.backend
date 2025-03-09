import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IRun } from '../../core/interfaces/run.interface';

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
}

export const RunSchema = SchemaFactory.createForClass(Run);
