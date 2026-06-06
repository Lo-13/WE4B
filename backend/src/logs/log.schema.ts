import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LogDocument = HydratedDocument<Log>;

@Schema()
export class Log {

  @Prop({ required: true }) userId: string;

  @Prop({ required: true }) userEmail: string;

  @Prop({ required: true, enum: ['client', 'admin', 'super-admin'] }) role: string;

  @Prop({ required: true }) action: string;

  @Prop({ type: Object, default: {} })
  details: Record<string, any>;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const LogSchema = SchemaFactory.createForClass(Log);