import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { ProductsModule } from 'src/products/products.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/common/schemas/user.schema';
import { Product, ProductSchema } from 'src/common/schemas/product.schema';
import { UserProductListSchema } from 'src/common/schemas/user-product-lists.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: User.name, schema: UserSchema },
      { name: 'LikedProducts', schema: UserProductListSchema },
      { name: 'ViewedProducts', schema: UserProductListSchema },
    ]),
    ProductsModule,
  ],
  providers: [UsersService, JwtStrategy],
  controllers: [UsersController],
})
export class UsersModule {}
