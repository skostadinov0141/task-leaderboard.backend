import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { LoginDto } from './dtos/login.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { Public } from './guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Create a new user
   */
  @Post()
  @Public()
  async create(@Body() payload: CreateUserDto) {
    return this.userService.create(payload);
  }

  /**
   * Update a user
   */
  @Put(':id')
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() payload: UpdateUserDto) {
    return this.userService.update(id, payload);
  }

  /**
   * Log in a user
   */
  @Post('login')
  @Public()
  async login(@Body() payload: LoginDto) {
    return this.userService.signIn(payload.username, payload.password);
  }

  /**
   * Refresh a user's token
   */
  @Post('refresh')
  @Public()
  async refresh(@Body() payload: RefreshTokenDto) {
    return this.userService.refreshToken(payload.refreshToken);
  }
}
