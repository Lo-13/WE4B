import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { Body, Controller, Get, Param, ParseIntPipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomsService } from './rooms.service';

const uploadDirectory = join(process.cwd(), 'uploads', 'rooms');
mkdirSync(uploadDirectory, { recursive: true });

type UploadedRoomFile = {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
};

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.findOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', {
    dest: uploadDirectory,
    limits: { fileSize: 5 * 1024 * 1024 },
  }))
  create(@Body() createRoomDto: CreateRoomDto, @UploadedFile() image?: UploadedRoomFile) {
    return this.roomsService.create(createRoomDto, image);
  }
}
