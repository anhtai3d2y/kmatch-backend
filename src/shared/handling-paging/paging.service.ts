import { Injectable } from '@nestjs/common';

@Injectable()
export class PagingService {
  async controlPaging(data, paging) {
    const returnData: any = {};
    if (!paging.page) {
      paging.page = 1;
    }
    if (!paging.limit) {
      paging.limit = 50;
    }
    if (paging.nolimit === 'true') {
      paging.limit = data.length;
    }
    const last_page = Math.ceil(data.length / paging.limit);
    if (Number(paging.page) > last_page) {
      paging.page = last_page;
    }
    returnData.data = data.slice(
      (paging.page - 1) * paging.limit,
      paging.page * paging.limit,
    );
    returnData.total = data.length;
    returnData.limit = Number(paging.limit);
    returnData.page = Number(paging.page);
    returnData.last_page = last_page;
    return returnData;
  }
}
