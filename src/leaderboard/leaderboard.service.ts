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

  async isUserAdmin(leaderboard: Leaderboard, user: User) {
    return leaderboard.admins.includes(user);
  }

  async isUserOwner(leaderboard: Leaderboard, user: User) {
    return leaderboard.owner._id.toString() === user._id.toString();
  }

  async createTask(leaderboard: string, payload: CreateTaskDto) {
    const foundLeaderboard = await this.leaderboardModel
      .findById(leaderboard)
      .exec();
    const task = new this.taskModel({
      ...payload,
      leaderboard: foundLeaderboard._id,
      avgCompletionTime: 0,
    });
    await task.save();
    foundLeaderboard.tasks.push(task._id as unknown as Task);
    await foundLeaderboard.save();
    return task;
  }

  async create(user: User, payload: CreateLeaderboardDto) {
    const leaderboard = new this.leaderboardModel({
      ...payload,
      owner: user,
      tasks: [],
      users: [user],
      admins: [user],
    });
    await leaderboard.save();
    const tasks = payload.tasks.map((taskData) => {
      return new this.taskModel({
        ...taskData,
        leaderboard: leaderboard._id,
      });
    });
    leaderboard.tasks = tasks.map((task) => task._id) as unknown as Task[];
    await Promise.all(tasks.map((task) => task.save()));
    return leaderboard.save();
  }

  async findAll() {
    return this.leaderboardModel.find().populate(['tasks']).exec();
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
    if (!(await this.isUserOwner(leaderboard, user)))
      throw new HttpException('Forbidden', 403);
    const adminUser = await this.userService.getOne(adminId);
    if (!adminUser) {
      throw new HttpException('User not found', 404);
    }
    leaderboard.admins.push(adminUser._id as unknown as User);
    return leaderboard.save();
  }

  async removeAdmin(leaderboardId: string, user: User, adminId: string) {
    const leaderboard = await this.findOneLeaderboard(leaderboardId);
    if (!(await this.isUserOwner(leaderboard, user)))
      throw new HttpException('Forbidden', 403);
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
    leaderboard.users.push(user._id as unknown as User);
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
    task.runs.push(run._id as unknown as Run);
    await task.save();
    return run;
  }

  async endRun(runId: string, user: User) {
    const run = await this.getOneRun(runId);
    if (run.user._id.toString() !== user._id.toString()) {
      throw new HttpException('Forbidden', 403);
    }
    if (run.endTime) throw new HttpException('Run already finished', 400);
    const task = await this.findOneTask(run.task._id);
    const endTime = new Date();
    const duration = endTime.getTime() - run.createdAt.getTime();
    const averageDifference = duration - (task.avgCompletionTime || 0);
    let finalReward: number = 0;
    if (averageDifference < 0) {
      finalReward += Math.abs(averageDifference) * task.multiplier;
    } else {
      finalReward = task.baseReward;
    }
    run.duration = duration;
    run.finalReward = finalReward;
    run.endTime = endTime;
    await run.save();
    task.avgCompletionTime = await this.calculateAverageCompletionTime(
      task._id,
    );
    await task.save();
    return run;
  }

  async calculateAverageCompletionTime(taskId: string) {
    const task = await this.taskModel.findById(taskId).populate('runs').exec();
    if (!task) throw new HttpException('Task not found', 404);
    console.log(task);
    if (task.runs.length === 0) return 0;
    const totalDuration = task.runs.reduce((acc, run) => {
      return acc + (run.duration || 0);
    }, 0);
    console.log(totalDuration);
    return totalDuration / task.runs.length;
  }
}
