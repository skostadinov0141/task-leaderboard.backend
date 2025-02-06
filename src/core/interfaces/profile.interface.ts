import { IUser } from './user.interface';
import { IAchievement } from './achievement.interface';

export interface IProfile {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  owner: IUser;
  achievements: IAchievement[];
  avatarPath: string;
  bio: string;
  displayName: string;
}
