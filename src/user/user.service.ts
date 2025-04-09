import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../core/schemas/user.schema';
import { Model } from 'mongoose';
import { SignUpDto } from './dtos/sign-up.dto';
import { AuthService } from '../auth/auth.service';
import { SignInDto } from './dtos/sign-in.dto';
import { TokenPairDto } from '../auth/dtos/token-pair.dto';

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
}
