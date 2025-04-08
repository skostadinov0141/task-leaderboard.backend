import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { TokenService } from './token/token.service';
import { TokenModule } from './token/token.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register(),
    MongooseModule.forRoot(
      'mongodb://root:secret@localhost:27017/leaderboard?authSource=admin',
    ),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    TokenModule,
  ],
  controllers: [AppController],
  providers: [AppService, TokenService],
})
export class AppModule {}
