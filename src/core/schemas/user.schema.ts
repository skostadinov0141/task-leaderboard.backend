import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Achievement } from './achievement.schema';
import { Leaderboard } from './leaderboard.schema';
import { Run } from './run.schema';

@Schema({ timestamps: true })
export class User {
  _id: string;
  createdAt: Date;
  updatedAt: Date;

  @Prop()
  googleId: string;
  @Prop()
  lastLogin: Date;
  @Prop()
  profile: Profile;
  @Prop()
  role: Role;
  @Prop()
  email: string;
}

export class Profile {
  @Prop()
  displayName: string;
  @Prop()
  bio: string;
  @Prop()
  preferredLanguage: string;
  @Prop()
  pronouns: string;
  @Prop({ type: [mongoose.Types.ObjectId], ref: 'Achievement' })
  achievements: Achievement[];
  @Prop()
  leaderboardsDisplay: LeaderboardDisplay[];
  @Prop()
  runsDisplay: RunDisplay[];
}

export class LeaderboardDisplay {
  @Prop({ type: mongoose.Types.ObjectId, ref: 'Leaderboard' })
  leaderboard: Leaderboard;
  @Prop()
  displayColor: string;
  @Prop()
  displayName: string;
  @Prop()
  description: string;
}

export class RunDisplay {
  @Prop({ type: mongoose.Types.ObjectId, ref: 'Run' })
  run: Run;
  @Prop()
  displayColor: string;
  @Prop()
  displayName: string;
  @Prop()
  description: string;
}

export class Role {
  @Prop()
  name: string;
  @Prop()
  privs: EPrivileges[];
  @Prop()
  changeHistory: RoleChangeHistoryEntry[];
}

export class RoleChangeHistoryEntry {
  @Prop()
  action: ERoleHistoryAction;
  @Prop()
  date: Date;
  @Prop()
  value: string;
}

export enum EPrivileges {}
export enum ERoleHistoryAction {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
}

export const UserSchema = SchemaFactory.createForClass(User);
