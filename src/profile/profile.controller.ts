import { Controller, Delete, Get, Param, Put, Query } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { SearchQueryParamsDto } from '../core/search-query-params.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.profileService.getById(id);
  }

  @Get()
  async findAll(@Query() searchQueryParamsDto: SearchQueryParamsDto) {
    return this.profileService.getAll(searchQueryParamsDto);
  }

  @Get('get-by-owner/:ownerId')
  async findByOwner(@Param('ownerId') ownerId: string) {
    return this.profileService.getByOwner(ownerId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Query() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.update(id, updateProfileDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.profileService.delete(id);
  }
}
