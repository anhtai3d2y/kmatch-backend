import { Test, TestingModule } from '@nestjs/testing';
import { InterestedRelationController } from './interested-relation.controller';
import { InterestedRelationService } from './interested-relation.service';

describe('InterestedRelationController', () => {
  let controller: InterestedRelationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InterestedRelationController],
      providers: [InterestedRelationService],
    }).compile();

    controller = module.get<InterestedRelationController>(InterestedRelationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
