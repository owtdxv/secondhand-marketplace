import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/common/schemas/product.schema';
import { UserProductListSchema } from 'src/common/schemas/user-product-lists.schema';
import { AuthModule } from 'src/auth/auth.module';
import { User, UserSchema } from 'src/common/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: User.name, schema: UserSchema },
      { name: 'LikedProducts', schema: UserProductListSchema },
      { name: 'ViewedProducts', schema: UserProductListSchema },
    ]),
    AuthModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, JwtStrategy],
  exports: [ProductsService],
})
export class ProductsModule {}
