import { Test, TestingModule } from '@nestjs/testing';
import { InterestedGenderService } from './interested-gender.service';

describe('InterestedGenderService', () => {
  let service: InterestedGenderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InterestedGenderService],
    }).compile();

    service = module.get<InterestedGenderService>(InterestedGenderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
