import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
  async createOrGetChatRoom(participants: string[]) {
    // 참가자 배열의 유효성을 검사합니다.
    if (!Array.isArray(participants) || participants.length !== 2) {
      throw new BadRequestException('participants는 정확히 2명이어야 합니다.');
    }

    if (participants[0] === participants[1]) {
      throw new BadRequestException('참여자 ID는 서로 달라야 합니다.');
    }

    // 참가자 ID를 ObjectId로 변환하고 오름차순으로 정렬하여 일관성을 유지합니다.
    const objectIds = participants.map((id) => new Types.ObjectId(id));
    objectIds.sort(); // 오름차순 정렬

    // 정렬된 참가자 목록을 기준으로 기존 채팅방을 찾습니다.
    let chatRoom = await this.chatRoomModel.findOne({
      participants: objectIds,
    });

    // 기존 채팅방이 없는 경우
    if (!chatRoom) {
      chatRoom = await this.chatRoomModel.create({
        participants: objectIds,
      });
      console.log('새로운 채팅방이 생성되었습니다.');
    } else {
      chatRoom = await this.chatRoomModel.findOneAndUpdate(
        { _id: chatRoom._id }, // 업데이트할 채팅방의 ID를 기준으로 찾습니다.
        { $set: { isNewChatRoom: true } }, // isNewChatRoom 필드를 true로 설정합니다.
        { new: true, runValidators: true }, // 업데이트된 문서를 반환하고, 업데이트 시 스키마 유효성 검사를 실행합니다.
      );
      console.log('기존 채팅방의 isNewChatRoom이 true로 업데이트되었습니다.');
    }

    // chatRoom이 성공적으로 생성되거나 업데이트되었는지 확인합니다.
    if (!chatRoom) {
      throw new InternalServerErrorException(
        '채팅방을 생성하거나 업데이트하는 데 실패했습니다.',
      );
    }

    // 생성되거나 업데이트된 채팅방의 ID를 반환합니다.
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
      .sort({ updatedAt: -1 })
      .lean<ChatRoomDocument[]>();

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
          createdAt: room.createdAt,
          updatedAt: room.updatedAt,
          isNewChatRoom: room.isNewChatRoom,
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
      .find({ chatRoomId: new Types.ObjectId(roomId) })
      .populate('senderId', 'displayName profileImage')
      .sort({ sentAt: 1 });

    return messages;
  }

  /**
   * roomId를 사용하여 해당 채팅방의 정보를 가져옵니다
   * @param roomId
   * @param uid
   * @returns
   */
  async getChatRoomInfoByRoomId(roomId: string, uid: string) {
    const chatRoomInfo = await this.chatRoomModel
      .findById(roomId)
      .populate('participants', 'displayName profileImage')
      .lean<ChatRoomDocument>();
    if (!chatRoomInfo) {
      throw new NotFoundException('채팅방을 찾을 수 없습니다.');
    }
    const isParticipant = chatRoomInfo.participants.some(
      (participant: {
        _id: Types.ObjectId | string;
        displayName?: string;
        profileImage?: string;
      }) => participant._id.toString() === uid,
    );

    if (!isParticipant) {
      throw new ForbiddenException('해당 채팅방에 접근할 권한이 없습니다.');
    }

    return chatRoomInfo;
  }
}
