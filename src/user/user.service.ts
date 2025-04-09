import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../core/schemas/user.schema';
import { Model } from 'mongoose';
import { SignUpDto } from './dtos/sign-up.dto';
import { AuthService } from '../auth/auth.service';
import { SignInDto } from './dtos/sign-in.dto';
import { TokenPairDto } from '../auth/dtos/token-pair.dto';
import { UpdatePreferencesDto } from './dtos/update-preferences.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly tokenService: AuthService,
  ) {}

  async signUp(payload: SignUpDto): Promise<TokenPairDto> {
    const {
      email,
      name,
      sub: googleId,
    } = await this.tokenService.validateGoogleIdToken(payload.idToken);
    const existingUser = await this.userModel.findOne({ googleId });
    if (existingUser) {
      throw new HttpException('User already exists', 409);
    }
    const newUser = new this.userModel({
      email,
      name,
      googleId,
      profile: {
        displayName: name,
      },
    });
    const savedUser = await newUser.save();
    return await this.tokenService.createTokenPair(savedUser._id);
  }

  async signIn(payload: SignInDto): Promise<TokenPairDto> {
    const { sub: googleId } = await this.tokenService.validateGoogleIdToken(
      payload.idToken,
    );
    const existingUser = await this.userModel.findOne({ googleId });
    if (!existingUser) {
      throw new HttpException('User not found', 404);
    }
    return await this.tokenService.createTokenPair(existingUser._id);
  }

  async getUserById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    return user;
  }

  async changeDisplayName(userId: string, displayName: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException(`User with id ${userId} not found`);
    user.profile.displayName = displayName;
    await user.save();
    return user;
  }

  async changeBio(userId: string, bio: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException(`User with id ${userId} not found`);
    user.profile.bio = bio;
    await user.save();
    return user;
  }

  async changePreferences(
    userId: string,
    preferences: UpdatePreferencesDto,
  ): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException(`User with id ${userId} not found`);
    user.profile.preferredLanguage = preferences.preferredLanguage;
    user.profile.pronouns = preferences.pronouns;
    await user.save();
    return user;
  }
}
