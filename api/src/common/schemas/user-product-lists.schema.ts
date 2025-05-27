import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type UserProductListDocument = UserProductList & Document;

@Schema()
export class UserProductList {
  @Prop({ type: Types.ObjectId, ref: "User", required: true, unique: true })
  uid!: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: "Product" })
  productIds!: Types.ObjectId[];
}

export const UserProductListSchema =
  SchemaFactory.createForClass(UserProductList);
