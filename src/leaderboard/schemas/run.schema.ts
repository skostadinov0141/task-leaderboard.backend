import { Schema } from '@nestjs/mongoose';
import { IRun } from '../../core/interfaces/run.interface';

@Schema({ timestamps: true })
export class Run implements IRun {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  startTime: Date;
  endTime: Date;
  duration: number;
  finalReward: number;
}
