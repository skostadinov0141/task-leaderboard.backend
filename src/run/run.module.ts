import { Module } from '@nestjs/common';
import { RunService } from './run.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RunSchema } from '../core/schemas/run.schema';
import { UserModule } from '../user/user.module';

@Module({
  providers: [RunService],
  imports: [
    UserModule,
    MongooseModule.forFeature([
      {
        name: 'Run',
        schema: RunSchema,
      },
    ]),
  ],
  exports: [RunService],
})
export class RunModule {}
