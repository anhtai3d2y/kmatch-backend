import { Test, TestingModule } from '@nestjs/testing';
import { SuperLikeService } from './super-like.service';

describe('SuperLikeService', () => {
  let service: SuperLikeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuperLikeService],
    }).compile();

    service = module.get<SuperLikeService>(SuperLikeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
