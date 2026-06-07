export class CreateFileMetadataDto {
  fileName!: string;
  mimeType!: string;
  size!: number;
  uploadedBy?: number;
  linkedEntity?: string;
  linkedEntityId?: number;
  metadata?: Record<string, unknown>;
}
