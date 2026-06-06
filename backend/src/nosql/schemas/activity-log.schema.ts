import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ActivityLogDocument = HydratedDocument<ActivityLog>;

@Schema({ collection: 'activity_logs', timestamps: true })
export class ActivityLog {
  @Prop()
  userId?: number;

  @Prop()
  email?: string;

  @Prop({ required: true })
  action!: string;

  @Prop({ required: true })
  targetType!: string;

  @Prop()
  targetId?: number;

  @Prop({ type: Object, default: {} })
  metadata!: Record<string, unknown>;
}

export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog);
