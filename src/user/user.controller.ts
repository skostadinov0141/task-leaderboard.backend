import { Body, Controller, Get, Patch, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from '../auth/is-public.decorator';
import { SignUpDto } from './dtos/sign-up.dto';
import { TokenPairDto } from '../auth/dtos/token-pair.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateDisplayNameDto } from './dtos/update-display-name.dto';
import { User } from '../core/schemas/user.schema';
import { UpdateBioDto } from './dtos/update-bio.dto';
import { UpdatePreferencesDto } from './dtos/update-preferences.dto';
import { AddLeaderboardDisplayDto } from './dtos/add-leaderboard-display.dto';

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

  /**
   * Change display name of the user.
   */
  @Patch('profile/display-name')
  @ApiBearerAuth()
  async changeDisplayName(
    @Req() request: any,
    @Body() payload: UpdateDisplayNameDto,
  ): Promise<User> {
    return await this.userService.changeDisplayName(
      request.user,
      payload.displayName,
    );
  }

  /**
   * Update bio of the user.
   */
  @Patch('profile/bio')
  @ApiBearerAuth()
  async updateBio(
    @Req() request: any,
    @Body() payload: UpdateBioDto,
  ): Promise<User> {
    return await this.userService.changeBio(request.user, payload.bio);
  }

  /**
   * Update preferences of the user.
   */
  @Patch('profile/preferences')
  @ApiBearerAuth()
  async updatePreferences(
    @Req() request: any,
    @Body() payload: UpdatePreferencesDto,
  ): Promise<User> {
    return await this.userService.changePreferences(request.user, payload);
  }

  /**
   * Add a new leaderboard to the user's display list.
   */
  @Patch('profile/leaderboard-display')
  @ApiBearerAuth()
  async addLeaderboardDisplay(
    @Req() request: any,
    @Body() payload: AddLeaderboardDisplayDto,
  ): Promise<User> {
    return await this.userService.addLeaderboardDisplay(request.user, payload);
  }
}
