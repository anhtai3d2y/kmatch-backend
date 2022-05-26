import { Module } from '@nestjs/common';
import { InterestedRelationService } from './interested-relation.service';
import { InterestedRelationController } from './interested-relation.controller';

@Module({
  controllers: [InterestedRelationController],
  providers: [InterestedRelationService]
})
export class InterestedRelationModule {}
