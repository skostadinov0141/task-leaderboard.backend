import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from '../auth/is-public.decorator';
import { SignUpDto } from './dtos/sign-up.dto';
import { TokenPairDto } from '../auth/dtos/token-pair.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('sign-up')
  @Public()
  async signUp(@Body() payload: SignUpDto): Promise<TokenPairDto> {
    return await this.userService.signUp(payload);
  }
}
