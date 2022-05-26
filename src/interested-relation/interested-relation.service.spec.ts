import { Test, TestingModule } from '@nestjs/testing';
import { InterestedRelationService } from './interested-relation.service';

describe('InterestedRelationService', () => {
  let service: InterestedRelationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InterestedRelationService],
    }).compile();

    service = module.get<InterestedRelationService>(InterestedRelationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
