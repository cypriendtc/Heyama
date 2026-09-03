import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class ObjectEntity extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop()
  thumbnailUrl: string;

  @Prop()
  createdAt: Date;
}

export const ObjectSchema = SchemaFactory.createForClass(ObjectEntity);
