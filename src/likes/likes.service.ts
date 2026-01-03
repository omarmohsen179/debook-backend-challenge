import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Like } from './entities/like.entity';
import { Post } from '../posts/entities/post.entity';
import { LikeResponseDto } from './dto/like-response.dto';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likesRepository: Repository<Like>,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Create a like (idempotent operation)
   * Handles duplicate likes gracefully by catching unique constraint violation
   */
  async createLike(postId: string, userId: string): Promise<LikeResponseDto> {
    // Verify post exists
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    try {
      // Try to create the like
      const like = this.likesRepository.create({ postId, userId });
      await this.likesRepository.save(like);

      // Emit event for async notification processing
      this.eventEmitter.emit('like.created', { 
        postId, 
        userId, 
        postAuthorId: post.authorId 
      });

      return LikeResponseDto.success(false);
    } catch (error) {
      // Handle unique constraint violation (code 23505 for PostgreSQL)
      if (error.code === '23505') {
        // Idempotent: return success even if already exists
        return LikeResponseDto.success(true);
      }
      // Re-throw any other errors
      throw error;
    }
  }

  /**
   * Check if a user has liked a post
   */
  async hasUserLiked(postId: string, userId: string): Promise<boolean> {
    const count = await this.likesRepository.count({ 
      where: { postId, userId } 
    });
    return count > 0;
  }

  /**
   * Get total likes count for a post
   */
  async getLikesCount(postId: string): Promise<number> {
    return await this.likesRepository.count({ where: { postId } });
  }
}
