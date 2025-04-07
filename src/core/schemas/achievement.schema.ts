import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Achievement {
  _id: string;
  createdAt: Date;
  updatedAt: Date;

  @Prop()
  name: string;
  @Prop()
  color: string;
  @Prop()
  icon: string;
  @Prop()
  description: string;
}

export const AchievementSchema = SchemaFactory.createForClass(Achievement);
