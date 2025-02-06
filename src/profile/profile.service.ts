import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile } from './schema/profile.schema';
import { Model } from 'mongoose';
import { CreateProfileDto } from './dtos/create-profile.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private readonly profileModel: Model<Profile>,
  ) {}

  async create(payload: CreateProfileDto): Promise<Profile> {
    const createdProfile = new this.profileModel(payload);
    return createdProfile.save();
  }

  async getById(id: string): Promise<Profile> {
    return this.profileModel.findById(id).exec();
  }

  async getByOwner(owner: any): Promise<Profile> {
    return this.profileModel.findOne({ owner }).exec();
  }

  async update(id: string, payload: UpdateProfileDto): Promise<Profile> {
    return this.profileModel
      .findByIdAndUpdate(id, payload, { new: true })
      .exec();
  }
}
