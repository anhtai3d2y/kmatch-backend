import { Test, TestingModule } from '@nestjs/testing';
import { SuperLikeController } from './super-like.controller';
import { SuperLikeService } from './super-like.service';

describe('SuperLikeController', () => {
  let controller: SuperLikeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuperLikeController],
      providers: [SuperLikeService],
    }).compile();

    controller = module.get<SuperLikeController>(SuperLikeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
