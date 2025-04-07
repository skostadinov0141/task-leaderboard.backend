import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../core/schemas/user.schema';
import { Model } from 'mongoose';
import { SignUpDto } from './dtos/sign-up.dto';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import * as process from 'node:process';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private configService: ConfigService,
  ) {}

  async validateIdToken(idToken: string): Promise<TokenPayload> {
    const client = new OAuth2Client();
    const ticket = await client
      .verifyIdToken({
        idToken,
        audience: this.configService.get('GOOGLE_CLIENT_ID'),
      })
      .catch((reason) => {
        console.error('Error verifying ID token:', reason);
        throw new HttpException('Invalid ID token', 401);
      });
    const payloadData = ticket.getPayload();
    if (!payloadData) {
      throw new HttpException('Invalid ID token', 401);
    }
    return payloadData;
  }

  async signUp(payload: SignUpDto): Promise<User> {
    const {
      email,
      name,
      sub: googleId,
    } = await this.validateIdToken(payload.idToken);
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
