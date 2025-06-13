import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  UseGuards,
  ForbiddenException,
  Put,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { ProductsService } from 'src/products/products.service';
import { AuthService } from 'src/auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private productService: ProductsService,
    private authService: AuthService,
  ) {}

  @Get('/:uid')
  getUserInfo(@Param('uid') uid: string) {
    return this.userService.getUserInfo(uid);
  }

  @Put('/edit/profile-img')
  @UseGuards(AuthGuard('jwt'))
  editProfileImage(@Req() req, @Body('url') url: string) {
    return this.userService.editProfileImage(req.user.uid, url);
  }

  @Put('/edit/displayname')
  @UseGuards(AuthGuard('jwt'))
  async changeName(
    @Req() req: any,
    @Body() body: { displayName: string },
  ): Promise<any> {
    const uid = req.user.uid;
    const { displayName } = body;
    const success = (await this.userService.changeDisplayName(uid, displayName))
      .success;
    return this.authService.getProfile(uid);
  }

  @Get('/product/sold/:uid')
  @UseGuards(AuthGuard('jwt'))
  getSoldProduct(
    @Param('uid') uid: string,
    @Req() req,
    @Query('page') page = '1',
    @Query('filter') filter: string,
  ) {
    if (req.user.uid !== uid) {
      throw new ForbiddenException('접근 권한이 없습니다.');
    }
    return this.productService.getSoldProduct(uid, parseInt(page), 10, filter);
  }

  @Get('/product/soldout/:uid')
  @UseGuards(AuthGuard('jwt'))
  getSoldOutProduct(
    @Param('uid') uid: string,
    @Req() req,
    @Query('page') page = '1',
    @Query('filter') filter: string,
  ) {
    if (req.user.uid !== uid) {
      throw new ForbiddenException('접근 권한이 없습니다.');
    }
    return this.productService.getSoldOutProduct(
      uid,
      parseInt(page),
      10,
      filter,
    );
  }

  @Get('/:uid/likes')
  @UseGuards(AuthGuard('jwt'))
  getUserLikesProduct(
    @Param('uid') uid: string,
    @Req() req,
    @Query('page') page = '1',
    @Query('filter') filter: string,
  ) {
    if (req.user.uid !== uid) {
      throw new ForbiddenException('접근 권한이 없습니다.');
    }
    return this.productService.getLikedProduct(uid, parseInt(page), 10, filter);
  }

  @Get('/:uid/views')
  @UseGuards(AuthGuard('jwt'))
  getUserViewedProduct(@Param('uid') uid: string, @Req() req) {
    if (req.user.uid !== uid) {
      throw new ForbiddenException('접근 권한이 없습니다.');
    }
    return this.productService.getViewedProduct(uid);
  }
}
