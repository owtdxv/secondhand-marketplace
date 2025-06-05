import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ type: [String], required: true })
  images!: string[];

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  price!: number;

  @Prop({ required: true })
  category!: string;

  @Prop({ required: true })
  saleRegion!: string;

  @Prop()
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sellerId!: Types.ObjectId;

  @Prop({ required: true, enum: ['판매중', '판매완료'] })
  status!: '판매중' | '판매완료';

  @Prop({ default: 0 })
  likes!: number;

  @Prop({ default: 0 })
  views!: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
