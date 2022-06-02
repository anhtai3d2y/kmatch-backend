import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { matchesSchema } from './schemas/matches.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageErrorModule } from 'src/message-error/message-error.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Matches', schema: matchesSchema }]),
    MessageErrorModule,
  ],
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class MatchesModule {}
