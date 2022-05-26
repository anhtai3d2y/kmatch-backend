import { Test, TestingModule } from '@nestjs/testing';
import { LikeUsersService } from './like-users.service';

describe('LikeUsersService', () => {
  let service: LikeUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LikeUsersService],
    }).compile();

    service = module.get<LikeUsersService>(LikeUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
