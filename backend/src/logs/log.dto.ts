export class CreateLogDto {
  userId: string;
  userEmail: string;
  role: string;
  action: string;
  details?: Record<string, any>;
}