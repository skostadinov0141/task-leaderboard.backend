import { CreateTaskDto } from './create-task.dto';

export class CreateLeaderboardDto {
  title: string;
  description: string;
  tasks: CreateTaskDto[];
}
