import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthModule } from './auth/auth.module';
import { RunModule } from './run/run.module';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
    MongooseModule.forRoot(
      'mongodb://root:secret@localhost:27017/leaderboard?authSource=admin',
    ),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    RunModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
