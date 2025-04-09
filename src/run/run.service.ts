import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Run } from '../core/schemas/run.schema';
import { UserService } from '../user/user.service';

@Injectable()
export class RunService {
  constructor(
    @InjectModel('Run') private readonly runModel: Model<Run>,
    private readonly userService: UserService,
  ) {}

  async startRun(userId: string): Promise<Run> {
    const user = await this.userService.getUserById(userId);
    const run = new this.runModel({
      user: user,
    });
    await run.save();
    return run;
  }

  async stopRun(runId: string): Promise<Run> {
    const run = await this.runModel.findById(runId);
    if (!run) throw new NotFoundException(`Run with ID ${runId} not found`);
    run.completedAt = new Date();
    run.completionTime = Date.now() - run.startedAt.getTime();
    await run.save();
    return run;
  }

  async getRunById(runId: string): Promise<Run> {
    const run = await this.runModel.findById(runId).populate('user');
    if (!run) throw new NotFoundException(`Run with ID ${runId} not found`);
    return run;
  }
}
