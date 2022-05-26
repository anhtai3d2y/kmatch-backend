import { Test, TestingModule } from '@nestjs/testing';
import { DislikeUsersService } from './dislike-users.service';

describe('DislikeUsersService', () => {
  let service: DislikeUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DislikeUsersService],
    }).compile();

    service = module.get<DislikeUsersService>(DislikeUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
