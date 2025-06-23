import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user)
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다',
      );

    return this.authService.login(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getProfile(@Req() req: any): Promise<any> {
    // 이 상황에 any를 사용하는건 사실 적절하진 않지만 지금은 괜찮을거라 생각합니다
    const uid = req.user.uid;
    return this.authService.getProfile(uid);
  }

  @Post('signup')
  async signup(
    @Body() body: { email: string; password: string; displayName: string },
  ) {
    return this.authService.signup(body);
  }

  @Get('check-email')
  async checkEmail(
    @Query('email') email: string,
  ): Promise<{ isDuplicate: Boolean }> {
    return this.authService.checkEmailDuplicate(email);
  }

  @Get('check-name')
  async checkName(
    @Query('displayName') displayName: string,
  ): Promise<{ isDuplicate: Boolean }> {
    return this.authService.checkNameDuplicate(displayName);
  }

  @Get('/naver/callback')
  async naverLoginCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    console.log(`네이버 콜백 수신: code=${code}, state=${state}`);

    const origin =
      typeof req.query.origin === 'string' ? req.query.origin : '*';
    const html = await this.authService.handleNaverCallback(
      code,
      state,
      origin,
    );

    res.setHeader('Content-Type', 'text/html');
    return res.send(html);
  }
}
