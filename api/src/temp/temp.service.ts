import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Temp } from './schemas/temp.schema';
import { Model } from 'mongoose';

@Injectable()
export class TempService {
  constructor(@InjectModel(Temp.name) private tempModel: Model<Temp>) {}

  async findAll(): Promise<Temp[]> {
    return this.tempModel.find().exec();
  }

  async create(): Promise<Temp> {
    const created = new this.tempModel();
    created.test = '테스트';
    return created.save();
  }
}
