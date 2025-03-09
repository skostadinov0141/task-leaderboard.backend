import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Leaderboard } from './schemas/leaderboard.schema';
import { Model } from 'mongoose';
import { Task } from './schemas/task.schema';
import { Run } from './schemas/run.schema';
import { UserService } from '../user/user.service';
import { User } from '../user/schemas/user.schema';
import { CreateLeaderboardDto } from './dtos/create-leaderboard.dto';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateLeaderboardDto } from './dtos/update-leaderboard.dto';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectModel(Leaderboard.name)
    private readonly leaderboardModel: Model<Leaderboard>,
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
    @InjectModel(Run.name)
    private readonly runModel: Model<Run>,
    private readonly userService: UserService,
  ) {}

  async createTask(leaderboard: Leaderboard | string, payload: CreateTaskDto) {
    const foundLeaderboard =
      typeof leaderboard === 'string'
        ? await this.leaderboardModel.findById(leaderboard)
        : leaderboard;
    const task = new this.taskModel({
      ...payload,
      leaderboard: foundLeaderboard,
    });
    await task.save();
    return task;
  }

  async create(user: User, payload: CreateLeaderboardDto) {
    const leaderboard = new this.leaderboardModel({
      ...payload,
      owner: user,
      tasks: [],
    });
    const tasks = payload.tasks.map((task) =>
      this.createTask(leaderboard, task),
    );
    leaderboard.tasks = await Promise.all(tasks);
    leaderboard.users.push(user);
    leaderboard.admins.push(user);
    await leaderboard.save();
  }

  async findAll() {
    return this.leaderboardModel.find().exec();
  }

  async update(id: string, payload: UpdateLeaderboardDto, user: User) {
    const leaderboard = await this.leaderboardModel.findById(id).exec();
    if (!leaderboard.admins.includes(user)) {
      throw new HttpException('Forbidden', 403);
    }
    leaderboard.set(payload);
    return leaderboard.save();
  }

  async findOneLeaderboard(id: string) {
    const leaderboard = this.leaderboardModel.findById(id).exec();
    if (!leaderboard) throw new HttpException('Not found', 404);
    return leaderboard;
  }

  async findOneTask(taskId: string) {
    const task = this.taskModel.findById(taskId).exec();
    if (!task) throw new HttpException('Not found', 404);
    return task;
  }

  async addAdmin(leaderboardId: string, user: User, adminId: string) {
    const leaderboard = await this.findOneLeaderboard(leaderboardId);
    const adminUser = await this.userService.getOne(adminId);
    if (!adminUser) {
      throw new HttpException('User not found', 404);
    }
    leaderboard.admins.push(adminUser);
    return leaderboard.save();
  }

  async removeAdmin(leaderboardId: string, user: User, adminId: string) {
    const leaderboard = await this.findOneLeaderboard(leaderboardId);
    const adminUser = await this.userService.getOne(adminId);
    if (!adminUser) {
      throw new HttpException('User not found', 404);
    }
    leaderboard.admins = leaderboard.admins.filter(
      (admin) => admin !== adminUser,
    );
    return leaderboard.save();
  }

  async join(leaderboardId: string, user: User) {
    const leaderboard = await this.findOneLeaderboard(leaderboardId);
    leaderboard.users.push(user);
    return leaderboard.save();
  }

  async leave(leaderboardId: string, user: User) {
    const leaderboard = await this.findOneLeaderboard(leaderboardId);
    leaderboard.users = leaderboard.users.filter((u) => u !== user);
    return leaderboard.save();
  }

  async getOneRun(id: string) {
    return this.runModel.findById(id).exec();
  }

  async startRun(user: User, taskId: string) {
    const task = await this.findOneTask(taskId);
    const leaderboard = await this.findOneLeaderboard(task.leaderboard._id);
    const run = new this.runModel({
      user,
      leaderboard,
      task,
    });
    await run.save();
    task.runs.push(run);
    await task.save();
    return run;
  }

  async endRun(runId: string, user: User) {
    const run = await this.getOneRun(runId);
    if (run.user._id !== user._id) {
      throw new HttpException('Forbidden', 403);
    }
    const task = await this.findOneTask(run.task._id);
    const duration = run.endTime.getTime() - run.createdAt.getTime();
    const averageDifference = duration - task.avgCompletionTime;
    let finalReward: number;
    if (averageDifference < 0) {
      finalReward += Math.abs(averageDifference) * task.multiplier;
    } else {
      finalReward = task.baseReward;
    }
    run.duration = duration;
    run.finalReward = finalReward;
    await run.save();
    return run;
  }
}
