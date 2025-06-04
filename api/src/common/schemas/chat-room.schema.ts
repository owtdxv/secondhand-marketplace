import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChatRoomDocument = ChatRoom & Document;

@Schema({ timestamps: true })
export class ChatRoom {
  @Prop({
    type: [Types.ObjectId],
    ref: 'User',
    required: true,
    validate: {
      validator: (v: Types.ObjectId[]) => Array.isArray(v) && v.length === 2,
      message: 'participants는 정확히 2명의 사용자 ID 배열이어야 합니다.',
    },
  })
  participants!: Types.ObjectId[];

  @Prop()
  createdAt!: Date;

  @Prop()
  updatedAt!: Date;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
