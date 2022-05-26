import { Test, TestingModule } from '@nestjs/testing';
import { DislikeUsersController } from './dislike-users.controller';
import { DislikeUsersService } from './dislike-users.service';

describe('DislikeUsersController', () => {
  let controller: DislikeUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DislikeUsersController],
      providers: [DislikeUsersService],
    }).compile();

    controller = module.get<DislikeUsersController>(DislikeUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
