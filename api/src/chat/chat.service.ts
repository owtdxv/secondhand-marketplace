import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Message,
  MessageDocument,
} from 'src/common/schemas/chat-message.schema';
import {
  ChatRoom,
  ChatRoomDocument,
} from 'src/common/schemas/chat-room.schema';
import { Product, ProductDocument } from 'src/common/schemas/product.schema';
import { User, UserDocument } from 'src/common/schemas/user.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoomDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  /**
   * 새로운 채팅방을 생성하거나 기존에 생성된 채팅방 아이디를 반환합니다
   * @param participans 참여자들의 UID
   * @param productId 상품 ID
   *
   * @returns 채팅방 ID
   */
  async createOrGetChatRoom(participants: string[], productId: string) {
    if (!Array.isArray(participants) || participants.length !== 2) {
      throw new BadRequestException('participants는 정확히 2명이어야 합니다.');
    }
    if (!productId) {
      throw new BadRequestException('productId가 필요합니다.');
    }

    const objectIds = participants.map((id) => new Types.ObjectId(id));
    objectIds.sort(); // 오름차순 정렬

    let chatRoom = await this.chatRoomModel.findOne({
      productId,
      participants: objectIds,
    });

    if (!chatRoom) {
      chatRoom = await this.chatRoomModel.create({
        participants: objectIds,
        productId,
      });
    }

    return { chatRoomId: chatRoom._id };
  }

  /**
   * 해당 사용자가 소속된 채팅방들의 정보를 반환합니다
   * @param uid 현재 로그인한 사용자의 uid
   */
  async getChatRoomsByUserId(uid: string) {
    const userId = new Types.ObjectId(uid);
    const chatRooms = await this.chatRoomModel
      .find({ participants: userId })
      .populate('participants', 'displayName profileImage')
      .populate('productId', 'name sellerId')
      .sort({ updatedAt: -1 })
      .lean<ChatRoomDocument[]>();

    console.log(chatRooms);

    const chatRoomsWithLastMessage = await Promise.all(
      chatRooms.map(async (room) => {
        // 로그인 사용자가 아닌 상대방만 필터링
        const otherUser = room.participants.find(
          (p: any) => p._id.toString() !== uid,
        );

        const lastMessage = await this.messageModel
          .findOne({ chatRoomId: room._id })
          .sort({ sentAt: -1 })
          .lean();

        return {
          _id: room._id,
          otherUser,
          productId: room.productId,
          createdAt: room.createdAt,
          updatedAt: room.updatedAt,
          lastMessage: lastMessage || null,
        };
      }),
    );

    return chatRoomsWithLastMessage;
  }

  /**
   * 채팅방에서 주고 받은 메세지들을 모두 반환합니다
   * @param roomId 조회할 채팅방의 아이디
   * @returns 채팅 메세지 정보
   */
  async getMessagesByRoomId(roomId: string) {
    const messages = await this.messageModel
      .find({ chatRoomId: roomId })
      .populate('senderId', 'displayName profileImage')
      .sort({ sentAt: 1 });

    return messages;
  }
}
