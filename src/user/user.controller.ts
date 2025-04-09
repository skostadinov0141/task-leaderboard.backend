import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from '../auth/is-public.decorator';
import { SignUpDto } from './dtos/sign-up.dto';
import { TokenPairDto } from '../auth/dtos/token-pair.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Sign up a new user using Google ID token.
   */
  @Post('sign-up')
  @Public()
  async signUp(@Body() payload: SignUpDto): Promise<TokenPairDto> {
    return await this.userService.signUp(payload);
  }

  /**
   * Sign in an existing user using Google ID token.
   */
  @Post('sign-in')
  @Public()
  async signIn(@Body() payload: SignInDto): Promise<TokenPairDto> {
    return await this.userService.signIn(payload);
  }

  /**
   * Get own user.
   */
  @Get('me')
  @ApiBearerAuth()
  async getMe(@Req() request: any): Promise<any> {
    return await this.userService.getUserById(request.user);
  }
}
