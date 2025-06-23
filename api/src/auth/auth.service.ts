import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/common/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  /**
   * 인증된 사용자인지 검사합니다
   * @param {string} email 이메일입니다
   * @param {string} password 비밀번호입니다
   * @returns {Promise<any>} 사용자 정보
   */
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email });
    if (!user || user.active == 'BANNED') return null;

    const isMatch = await bcrypt.compare(password, user.password); // 비밀번호 일치 검사
    if (!isMatch) return null;

    const { password: _, ...result } = user.toObject(); // 가져온 사용자 정보에서 비밀번호를 제거합니다
    return result;
  }

  /**
   * 사용자 정보를 사용하여 새로운 JWT를 생성합니다
   * @param user validateUser가 반환한 사용자 정보
   * @returns accessToken(email, uid, name 포함)
   */
  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user._id,
      name: user.displayName,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  /**
   * (로컬 로그인) 새로운 사용자 정보를 생성합니다
   * @param body {email, password, displayName}
   */
  async signup(body: { email: string; password: string; displayName: string }) {
    const { email, password, displayName } = body;

    // 이미 검사하는 api가 존재하지만, 데이터가 조작되었을 우려가 있어 다시 검사
    const existing = await this.userModel.findOne({ email });
    if (existing) {
      throw new ConflictException('이미 가입된 메일입니다');
    }

    const nameExists = await this.userModel.findOne({ displayName });
    if (nameExists) {
      throw new ConflictException('이미 사용중인 닉네임입니다.');
    }

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,16}$/;
    if (!passwordRegex.test(password)) {
      throw new BadRequestException(
        '비밀번호는 영문, 숫자, 특수문자를 포함하여 8~16자여야 합니다.',
      );
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    const encodedName = encodeURIComponent(displayName);
    const user = new this.userModel({
      email,
      password: hashedPassword,
      displayName,
      profileImage: `https://ui-avatars.com/api/?name=${encodedName}&background=random`,
    });

    await user.save();

    const { password: _, ...result } = user.toObject();
    return result;
  }

  /**
   * DB에서 사용자 프로필 정보(비밀번호 제외)를 조회합니다
   * @param uid 사용자 uid
   */
  async getProfile(uid: string) {
    return this.userModel.findById(uid).select('-password').exec();
  }

  /**
   * 이메일 중복 여부를 검사합니다
   * @param email 이메일 값입니다
   */
  async checkEmailDuplicate(email: string): Promise<{ isDuplicate: boolean }> {
    const existing = await this.userModel.exists({ email });
    return { isDuplicate: !!existing };
  }

  /**
   * 닉네임 중복 여부를 검사합니다
   * @param displayName 닉네임
   */
  async checkNameDuplicate(
    displayName: string,
  ): Promise<{ isDuplicate: boolean }> {
    const existing = await this.userModel.exists({ displayName });
    return { isDuplicate: !!existing };
  }

  /**
   * 네이버 콜백을 처리합니다
   * @param code 네이버가 제공해준 code값
   * @param state 네이버가 제공해준 state값
   */
  async handleNaverCallback(code: string, state: string) {
    const tokenRes = await firstValueFrom(
      this.httpService.post('http://nid.naver.com/oauth2.0/token', null, {
        params: {
          grant_type: 'authorization_code',
          client_id: this.configService.get('NAVER_CLIENT_ID'),
          client_secret: this.configService.get('NAVER_CLIENT_SECRET'),
          code,
          state,
        },
      }),
    );

    const token = tokenRes.data.access_token;

    const profileRes = await firstValueFrom(
      this.httpService.get('https://openapi.naver.com/v1/nid/me', {
        headers: { Authorization: `Bearer ${token}` },
      }),
    );

    const profile = profileRes.data.response;

    // 사용자 찾기
    let user = await this.userModel.findOne({ socialId: profile.id }).exec();

    // 사용자가 없으면 새로 생성
    if (!user) {
      user = new this.userModel({
        email: profile.email,
        password: Math.random().toString(36).slice(-8),
        displayName: profile.nickname,
        profileImage: profile.profile_image,
        socialId: profile.id,
        provider: 'naver',
      });

      await user.save();
    } else {
      // 사용자가 존재할 경우, 프로필 정보 업데이트
      let isUpdated = false;

      if (user.displayName !== profile.nickname) {
        user.displayName = profile.nickname;
        isUpdated = true;
      }
      if (user.profileImage !== profile.profile_image) {
        user.profileImage = profile.profile_image;
        isUpdated = true;
      }

      if (isUpdated) {
        await user.save(); // 변경된 내용이 있으면 저장
      }
    }

    // 로그인 처리
    const { accessToken } = await this.login(user);

    return `
    <html>
      <body>
        <script>
          window.opener.postMessage(
            { accessToken: '${accessToken}' },
            'http://localhost:5173'
          );
          window.close();
        </script>
        <p>로그인 중...</p>
      </body>
    </html>
  `;
  }
}
