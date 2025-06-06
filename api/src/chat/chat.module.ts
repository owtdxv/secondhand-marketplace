import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from 'src/common/schemas/chat-message.schema';
import { ChatRoom, ChatRoomSchema } from 'src/common/schemas/chat-room.schema';
import { Product, ProductSchema } from 'src/common/schemas/product.schema';
import { User, UserSchema } from 'src/common/schemas/user.schema';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: ChatRoom.name, schema: ChatRoomSchema },
      { name: Message.name, schema: MessageSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService, JwtStrategy],
})
export class ChatModule {}
