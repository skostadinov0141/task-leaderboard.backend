import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from '../core/schemas/task.schema';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';

@Injectable()
export class TaskService {
  constructor(@InjectModel('Task') private readonly taskModel: Model<Task>) {}

  async create(payload: CreateTaskDto): Promise<Task> {
    const task = new this.taskModel(payload);
    await task.save();
    return task;
  }

  async update(id: string, payload: UpdateTaskDto) {
    const task = await this.taskModel.findByIdAndUpdate(id, payload);
    if (!task) throw new NotFoundException(`Task with id ${id} not found`);
    return task;
  }
}
