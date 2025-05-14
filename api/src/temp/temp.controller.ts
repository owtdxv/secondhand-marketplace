import { Controller, Get, Post } from '@nestjs/common';
import { TempService } from './temp.service';

@Controller('temp')
export class TempController {
  constructor(private readonly tempService: TempService) {}

  @Get()
  findAll() {
    return this.tempService.findAll();
  }

  @Post()
  create() {
    return this.tempService.create();
  }
}
