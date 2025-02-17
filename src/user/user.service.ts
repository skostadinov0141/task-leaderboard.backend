import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { ProfileService } from '../profile/profile.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { CreateProfileDto } from '../profile/dtos/create-profile.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly profileService: ProfileService,
  ) {}

  async create(payload: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel();
    const profilePayload: CreateProfileDto = {
      owner: createdUser._id,
      achievements: [],
      avatarPath: '',
      bio: '',
      displayName: payload.displayName,
    };
    createdUser.profile = await this.profileService.create(profilePayload);
    createdUser.passwordHash = payload.password;
    return createdUser.save();
  }

  async update(id: string, payload: UpdateUserDto): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, payload, { new: true });
  }
}
