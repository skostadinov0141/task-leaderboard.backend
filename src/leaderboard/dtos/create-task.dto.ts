export class CreateTaskDto {
  title: string;
  description: string;
  rules: string[];
  baseReward: number;
  multiplier: number;
}
