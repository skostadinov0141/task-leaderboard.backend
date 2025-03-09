import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { ProfileService } from '../profile/profile.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { CreateProfileDto } from '../profile/dtos/create-profile.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AuthTokenDto } from './dtos/auth-token.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly profileService: ProfileService,
    private readonly jwtService: JwtService,
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
    createdUser.username = payload.username;
    return createdUser.save();
  }

  async update(id: string, payload: UpdateUserDto): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, payload, { new: true });
  }

  async signIn(username: string, password: string): Promise<AuthTokenDto> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.passwordHash !== password) {
      throw new UnauthorizedException('Invalid password');
    }
    return this.createToken(user);
  }

  async createToken(user: User): Promise<AuthTokenDto> {
    const accessPayload = {
      sub: user._id,
    };
    const refreshPayload = {
      sub: user._id,
      type: 'refresh',
    };
    const accessToken = this.jwtService.sign(accessPayload, {
      expiresIn: '2h',
    });
    const refreshToken = this.jwtService.sign(refreshPayload, {
      expiresIn: '30d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthTokenDto> {
    const decoded = this.jwtService.verify(refreshToken);
    if (decoded.type !== 'refresh') {
      throw new UnauthorizedException('Invalid token');
    }
    const user = await this.getUserFromToken(refreshToken);
    return this.createToken(user);
  }

  async getUserFromToken(token: string): Promise<User> {
    const decoded = this.jwtService.verify(token);
    const user = await this.userModel.findById(decoded.sub).exec();
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    return user;
  }
}
