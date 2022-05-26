import { Module } from '@nestjs/common';
import { InterestedGenderService } from './interested-gender.service';
import { InterestedGenderController } from './interested-gender.controller';

@Module({
  controllers: [InterestedGenderController],
  providers: [InterestedGenderService]
})
export class InterestedGenderModule {}
