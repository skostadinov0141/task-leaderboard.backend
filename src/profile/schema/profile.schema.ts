import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IProfile } from '../../core/interfaces/profile.interface';
import mongoose from 'mongoose';
import { User } from '../../user/schemas/user.schema';

@Schema({ timestamps: true })
export class Profile implements IProfile {
  _id: string;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  owner: User;
  @Prop()
  achievements: any[];
  @Prop()
  avatarPath: string;
  @Prop()
  bio: string;
  @Prop()
  displayName: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
