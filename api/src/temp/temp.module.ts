import { Module } from '@nestjs/common';
import { TempService } from './temp.service';
import { TempController } from './temp.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Temp, TempSchema } from './schemas/temp.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Temp.name, schema: TempSchema }]),
  ],
  controllers: [TempController],
  providers: [TempService],
})
export class TempModule {}
