import { Test, TestingModule } from '@nestjs/testing';
import { AdminRequestService } from './admin-request.service';

describe('AdminRequestService', () => {
  let service: AdminRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminRequestService],
    }).compile();

    service = module.get<AdminRequestService>(AdminRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
