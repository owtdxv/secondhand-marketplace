import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('/:uid')
  getUserInfo(@Param('uid') uid: string) {
    return this.userService.getUserInfo(uid);
  }

  @Get('/:uid/likes')
  @UseGuards(AuthGuard('jwt'))
  getUserLikesProduct(@Param('uid') uid: string, @Req() req) {}

  @Get('/:uid/views')
  @UseGuards(AuthGuard('jwt'))
  getUserViewedProduct(@Param('uid') uid: string, @Req() req) {}
}
