import { EPriviliges } from '../enums/privileges.enum';

export interface IRole {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string;
  privileges: EPriviliges[];
}
