export interface IProfile {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  owner: any;
  achievements: any[];
  avatarPath: string;
  bio: string;
  displayName: string;
}
