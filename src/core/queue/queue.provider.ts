import { Provider } from '@nestjs/common';

import { CronsQueueService } from './crons/crons.queue.service';
import { QueueBoard } from './queue.board';
import { UsersQueueService } from './users/users.queue.service';

export const QUEUE_PROVIDER: Provider[] = [
  UsersQueueService,
  CronsQueueService,

  // board
  QueueBoard,
];
