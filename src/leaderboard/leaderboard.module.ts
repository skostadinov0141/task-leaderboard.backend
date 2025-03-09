import { Module } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardController } from './leaderboard.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Leaderboard, LeaderboardSchema } from './schemas/leaderboard.schema';
import { Task, TaskSchema } from './schemas/task.schema';
import { Run, RunSchema } from './schemas/run.schema';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [LeaderboardController],
  providers: [LeaderboardService],
  imports: [
    UserModule,
    MongooseModule.forFeature([
      {
        name: Leaderboard.name,
        schema: LeaderboardSchema,
      },
      {
        name: Task.name,
        schema: TaskSchema,
      },
      {
        name: Run.name,
        schema: RunSchema,
      },
    ]),
  ],
})
export class LeaderboardModule {}
