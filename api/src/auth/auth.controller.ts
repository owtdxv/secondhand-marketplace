import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
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
  getProfile(@Req() req: any): Promise<any> {
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
}
