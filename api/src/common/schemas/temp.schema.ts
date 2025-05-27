import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Temp extends Document {
  @Prop({ required: true })
  test: string;
}

export const TempSchema = SchemaFactory.createForClass(Temp);
