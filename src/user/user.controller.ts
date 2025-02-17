import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Create a new user
   */
  @Post()
  async create(@Body() payload: CreateUserDto) {
    return this.userService.create(payload);
  }

  /**
   * Update a user
   */
  @Put(':id')
  async update(@Param('id') id: string, @Body() payload: UpdateUserDto) {
    return this.userService.update(id, payload);
  }
}
