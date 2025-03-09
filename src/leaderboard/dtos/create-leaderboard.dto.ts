import { CreateTaskDto } from './create-task.dto';

export class CreateLeaderboardDto {
  admins: string[];
  users: string[];
  title: string;
  description: string;
  tasks: CreateTaskDto[];
}
