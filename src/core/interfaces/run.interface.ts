export interface IRun {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  endTime: Date;
  duration?: number;
  finalReward: number;
}
