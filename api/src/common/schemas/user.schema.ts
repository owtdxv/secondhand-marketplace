import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ required: true, unique: true })
  displayName!: string;

  @Prop({ default: null })
  profileImage?: string;

  @Prop({ required: true, enum: ['local', 'naver'], default: 'local' })
  provider!: 'local' | 'naver';

  @Prop({ required: true, enum: ['ACTIVE', 'BANNED'], default: 'ACTIVE' })
  active!: 'ACTIVE' | 'BANNED';
}

export const UserSchema = SchemaFactory.createForClass(User);
