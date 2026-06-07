import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FileMetadataDocument = HydratedDocument<FileMetadata>;

@Schema({ collection: 'file_metadata', timestamps: true })
export class FileMetadata {
  @Prop({ required: true })
  fileName!: string;

  @Prop({ required: true })
  mimeType!: string;

  @Prop({ required: true })
  size!: number;

  @Prop()
  uploadedBy?: number;

  @Prop()
  linkedEntity?: string;

  @Prop()
  linkedEntityId?: number;

  @Prop({ type: Object, default: {} })
  metadata!: Record<string, unknown>;
}

export const FileMetadataSchema = SchemaFactory.createForClass(FileMetadata);
