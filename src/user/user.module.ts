import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../core/schemas/user.schema';
import { TokenModule } from '../token/token.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    TokenModule,
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
    ]),
  ],
})
export class UserModule {}
