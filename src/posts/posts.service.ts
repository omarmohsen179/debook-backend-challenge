import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { Like } from '../likes/entities/like.entity';
import { Comment } from './entities/comment.entity';
import { PostResponseDto } from './dto/post-response.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(Like)
    private readonly likesRepository: Repository<Like>,
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
  ) {}

  /**
   * Find a post by ID and return it with counters
   * Uses efficient COUNT() queries instead of loading relations
   */
  async findOne(id: string): Promise<PostResponseDto> {
    // Find the post
    const post = await this.postsRepository.findOne({ where: { id } });
    
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // Efficient parallel counting (no relation loading)
    const [likesCount, commentsCount] = await Promise.all([
      this.likesRepository.count({ where: { postId: id } }),
      this.commentsRepository.count({ where: { postId: id } }),
    ]);

    return PostResponseDto.fromEntity(post, likesCount, commentsCount);
  }

  /**
   * Create a post (useful for testing)
   */
  async create(content: string, authorId: string): Promise<Post> {
    const post = this.postsRepository.create({ content, authorId });
    return await this.postsRepository.save(post);
  }
}
