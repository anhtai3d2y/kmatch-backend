import { Global, Module } from '@nestjs/common';
import { PagingService } from './paging.service';

@Global()
@Module({
  exports: [PagingService],
  providers: [PagingService],
})
export class HandlingPagingModule {}
