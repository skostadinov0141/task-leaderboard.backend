import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../core/schemas/user.schema';
import { Model } from 'mongoose';
import { SignUpDto } from './dtos/sign-up.dto';
import { ConfigService } from '@nestjs/config';
import { TokenService } from '../token/token.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly tokenService: TokenService,
  ) {}

  async signUp(payload: SignUpDto): Promise<User> {
    const {
      email,
      name,
      sub: googleId,
    } = await this.tokenService.validateGoogleIdToken(payload.idToken);
    const user = await this.userModel.findOne({ googleId });
    if (user) {
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
    return newUser;
  }
}
