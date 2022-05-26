import { Test, TestingModule } from '@nestjs/testing';
import { LikeUsersController } from './like-users.controller';
import { LikeUsersService } from './like-users.service';

describe('LikeUsersController', () => {
  let controller: LikeUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LikeUsersController],
      providers: [LikeUsersService],
    }).compile();

    controller = module.get<LikeUsersController>(LikeUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
