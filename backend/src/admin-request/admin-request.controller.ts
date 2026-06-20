import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { AdminRequestService } from './admin-request.service';
import { AdminRequestDto } from './dto/admin-request.dto';

@Controller('admin-request')
export class AdminRequestController {
  constructor(private readonly service: AdminRequestService) {}

  @Post()
  async create(@Body() dto: AdminRequestDto): Promise<AdminRequestDto> {
    const request = await this.service.create(dto);
    return {
      requestId: request.requestId,
      userId: request.userId,
      roomId: request.roomId,
      status: request.status as 'pending' | 'accepted' | 'denied',
      createdDate: request.createdDate,
    };
  }

  @Get('pending')
  findPending() {
    return this.service.findPending();
  }

  @Get('accepted')
  findAccepted() {
    return this.service.findAdmins();
  }

  @Patch(':id/accept')
  accept(@Param('id', ParseIntPipe) id: number) {
    return this.service.accept(id);
  }

  @Patch(':id/deny')
  deny(@Param('id', ParseIntPipe) id: number) {
    return this.service.deny(id);
  }
}
