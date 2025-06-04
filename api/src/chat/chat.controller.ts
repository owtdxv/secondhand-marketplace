import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('newchat')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createOrGetChatRoom(
    @Body() body: { participants: string[]; productId: string },
    @Req() req: any,
  ) {
    return this.chatService.createOrGetChatRoom(
      body.participants,
      body.productId,
    );
  }

  @Get('/rooms/:uid')
  @UseGuards(AuthGuard('jwt'))
  async getChatRooms(@Param('uid') uid: string, @Req() req: any) {
    if (req.user.uid != uid) {
      throw new ForbiddenException(
        '다른 사용자의 채팅방 목록을 조회할 수 없습니다.',
      );
    }
    return this.chatService.getChatRoomsByUserId(uid);
  }

  @Get('/message/:roomid')
  async getMessages(@Param('roomid') roomId: string) {
    return this.chatService.getMessagesByRoomId(roomId);
  }
}
