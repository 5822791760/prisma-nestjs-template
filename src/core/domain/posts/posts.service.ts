import { Injectable } from '@nestjs/common';

import myDayjs from '@core/shared/common/common.dayjs';
import { Read } from '@core/shared/common/common.type';

import { NewPostData, PostData } from './posts.type';

@Injectable()
export class PostsService {
  new(data: Read<NewPostData>): PostData {
    return {
      title: data.title,
      details: data.details,
      createdAt: myDayjs().toDate(),
      updatedAt: myDayjs().toDate(),
      createdBy: data.createdBy,
    };
  }
}
