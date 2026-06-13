import { Test, TestingModule } from '@nestjs/testing';
import { AdminRequestController } from './admin-request.controller';

describe('AdminRequestController', () => {
  let controller: AdminRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminRequestController],
    }).compile();

    controller = module.get<AdminRequestController>(AdminRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
