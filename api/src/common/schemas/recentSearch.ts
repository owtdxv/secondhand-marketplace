import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RecentSearchDocument = RecentSearch & Document;

@Schema({ timestamps: true })
export class RecentSearch {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  uid: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  keywords: string[];
}

export const RecentSearchSchema = SchemaFactory.createForClass(RecentSearch);
