import { IUser } from '../../core/interfaces/user.interface';
import { Profile } from '../../profile/schema/profile.schema';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export class User implements IUser {
  _id: string;
  createdAt: Date;
  updatedAt: Date;

  @Prop()
  username: string;
  @Prop()
  passwordHash: string;
  @Prop()
  roles: any[];
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Profile.name })
  profile: Profile;
}

export const UserSchema = SchemaFactory.createForClass(User);
