import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IProfile } from '../../core/interfaces/profile.interface';

@Schema({ timestamps: true })
export class Profile implements IProfile {
  _id: string;
  createdAt: Date;
  updatedAt: Date;

  @Prop()
  owner: any;
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
