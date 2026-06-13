import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminRequestEntity } from './admin-request.entity';
import { AdminRequestDto } from './dto/admin-request.dto';


@Injectable()
export class AdminRequestService {
    constructor(
        @InjectRepository(AdminRequestEntity)
        private adminRequestRepository: Repository<AdminRequestEntity>,
    ){}

    async create(dto: AdminRequestDto): Promise<AdminRequestEntity> {
        const userId = dto.userId;
        const roomId = dto.roomId;
        const newRequest = this.adminRequestRepository.create({
            userId,
            roomId,
            status: 'pending' as const,
            createdDate: new Date(),
        });
        return this.adminRequestRepository.save(newRequest);
    }
}


