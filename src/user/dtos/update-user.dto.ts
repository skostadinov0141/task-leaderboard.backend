import { CreateUserDto } from './create-user.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto, {
  skipNullProperties: true,
}) {
  displayName: null;
  passwordConfirm: string;
}
