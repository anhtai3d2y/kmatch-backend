import { Test, TestingModule } from '@nestjs/testing';
import { InterestedGenderController } from './interested-gender.controller';
import { InterestedGenderService } from './interested-gender.service';

describe('InterestedGenderController', () => {
  let controller: InterestedGenderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InterestedGenderController],
      providers: [InterestedGenderService],
    }).compile();

    controller = module.get<InterestedGenderController>(InterestedGenderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
