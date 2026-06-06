import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UsageStatDocument = HydratedDocument<UsageStat>;

@Schema({ collection: 'usage_stats', timestamps: true })
export class UsageStat {
  @Prop({ required: true })
  type!: string;

  @Prop()
  roomId?: number;

  @Prop()
  roomName?: string;

  @Prop({ default: 1 })
  count!: number;

  @Prop({ required: true })
  date!: string;

  @Prop({ type: Object, default: {} })
  metadata!: Record<string, unknown>;
}

export const UsageStatSchema = SchemaFactory.createForClass(UsageStat);
