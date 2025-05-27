import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ChatRoom, ChatRoomSchema } from './schemas/chat-room.schema';
import { Message, MessageSchema } from './schemas/chat-message.schema';
import { Product, ProductSchema } from './schemas/product.schema';
import {
  UserProductList,
  UserProductListSchema,
} from './schemas/user-product-lists.schema';

import { TempService } from './temp.service';
import { TempController } from './temp.controller';
import { User, UserSchema } from './schemas/user.schema';
import { Temp, TempSchema } from './schemas/temp.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: ChatRoom.name, schema: ChatRoomSchema },
      { name: Message.name, schema: MessageSchema },
      { name: Product.name, schema: ProductSchema },
      // UserProductList 기반 컬렉션 3개 등록
      { name: 'LikedProducts', schema: UserProductListSchema },
      { name: 'ViewedProducts', schema: UserProductListSchema },
      { name: 'RecommendedProducts', schema: UserProductListSchema },
      { name: Temp.name, schema: TempSchema },
    ]),
  ],
  controllers: [TempController],
  providers: [TempService],
})
export class TempModule {}
