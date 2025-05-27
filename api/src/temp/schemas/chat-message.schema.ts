import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop({ type: Types.ObjectId, ref: "ChatRoom", required: true })
  chatRoomId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  senderId!: Types.ObjectId;

  @Prop({ required: true })
  message!: string;

  @Prop({ default: Date.now })
  sentAt!: Date;

  @Prop({ default: false })
  read!: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
