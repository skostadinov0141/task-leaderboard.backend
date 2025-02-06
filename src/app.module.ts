import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://root:secret@localhost:27017/leaderboard?authSource=admin',
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
