import { IRole } from './role.interface';
import { IProfile } from './profile.interface';

export interface IUser {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  passwordHash: string;
  roles: IRole[];
  profile: IProfile;
}
