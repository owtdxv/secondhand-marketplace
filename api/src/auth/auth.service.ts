import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/common/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
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

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new this.userModel({
      email,
      password: hashedPassword,
      displayName,
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
   * 사용자 닉네임을 수정합니다
   * @param uid 사용자 uid
   * @param displayName 변경할 닉네임
   */
  async changeDisplayName(
    uid: String,
    displayName: string,
  ): Promise<{ success: Boolean }> {
    // 닉네임 중복 검사
    const existing = await this.userModel.exists({ displayName });
    if (existing) {
      throw new ConflictException('이미 사용중인 닉네임입니다.');
    }

    const result = await this.userModel.updateOne(
      { _id: uid },
      { $set: { displayName } },
    );

    return { success: result.modifiedCount > 0 };
  }
}
