import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService, LikeNotificationPayload } from '../notifications.service';

@Injectable()
export class LikeCreatedListener {
  private readonly logger = new Logger(LikeCreatedListener.name);

  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * Handle like.created event asynchronously
   * This runs after the like is saved, without blocking the HTTP response
   */
  @OnEvent('like.created')
  async handleLikeCreated(payload: LikeNotificationPayload) {
    this.logger.log(`🎯 Event received: like.created for post ${payload.postId}`);
    
    try {
      // Process notification asynchronously
      await this.notificationsService.sendLikeNotification(payload);
      
      // Could also store notification in database
      await this.notificationsService.storeNotification(payload);
    } catch (error) {
      // Log error but don't crash - notifications are non-critical
      this.logger.error(
        `Failed to process notification for post ${payload.postId}:`,
        error.message,
      );
    }
  }
}
