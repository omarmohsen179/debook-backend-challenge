import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { LikeCreatedListener } from './listeners/like-created.listener';

@Module({
  providers: [NotificationsService, LikeCreatedListener],
  exports: [NotificationsService],
})
export class NotificationsModule {}
