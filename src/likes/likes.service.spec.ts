import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotFoundException } from '@nestjs/common';
import { LikesService } from './likes.service';
import { Like } from './entities/like.entity';
import { Post } from '../posts/entities/post.entity';

describe('LikesService', () => {
  let service: LikesService;
  let likesRepository: jest.Mocked<Repository<Like>>;
  let postsRepository: jest.Mocked<Repository<Post>>;
  let eventEmitter: jest.Mocked<EventEmitter2>;

  const mockPost: Post = {
    id: 'post-123',
    content: 'Test post',
    authorId: 'author-123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockLike: Like = {
    id: 'like-123',
    postId: 'post-123',
    userId: 'user-123',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikesService,
        {
          provide: getRepositoryToken(Like),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            count: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Post),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LikesService>(LikesService);
    likesRepository = module.get(getRepositoryToken(Like));
    postsRepository = module.get(getRepositoryToken(Post));
    eventEmitter = module.get(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createLike', () => {
    it('should create a like successfully', async () => {
      postsRepository.findOne.mockResolvedValue(mockPost);
      likesRepository.create.mockReturnValue(mockLike);
      likesRepository.save.mockResolvedValue(mockLike);

      const result = await service.createLike('post-123', 'user-123');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Like created successfully');
      expect(result.alreadyLiked).toBe(false);
      expect(likesRepository.create).toHaveBeenCalledWith({
        postId: 'post-123',
        userId: 'user-123',
      });
      expect(likesRepository.save).toHaveBeenCalledWith(mockLike);
      expect(eventEmitter.emit).toHaveBeenCalledWith('like.created', {
        postId: 'post-123',
        userId: 'user-123',
        postAuthorId: 'author-123',
      });
    });

    it('should handle duplicate like (idempotent)', async () => {
      postsRepository.findOne.mockResolvedValue(mockPost);
      likesRepository.create.mockReturnValue(mockLike);
      likesRepository.save.mockRejectedValue({ code: '23505' }); // Unique constraint violation

      const result = await service.createLike('post-123', 'user-123');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Post already liked by this user');
      expect(result.alreadyLiked).toBe(true);
      expect(eventEmitter.emit).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if post does not exist', async () => {
      postsRepository.findOne.mockResolvedValue(null);

      await expect(service.createLike('post-123', 'user-123')).rejects.toThrow(
        NotFoundException,
      );
      expect(likesRepository.create).not.toHaveBeenCalled();
      expect(eventEmitter.emit).not.toHaveBeenCalled();
    });

    it('should rethrow other errors', async () => {
      postsRepository.findOne.mockResolvedValue(mockPost);
      likesRepository.create.mockReturnValue(mockLike);
      likesRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.createLike('post-123', 'user-123')).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('hasUserLiked', () => {
    it('should return true if user has liked the post', async () => {
      likesRepository.count.mockResolvedValue(1);

      const result = await service.hasUserLiked('post-123', 'user-123');

      expect(result).toBe(true);
      expect(likesRepository.count).toHaveBeenCalledWith({
        where: { postId: 'post-123', userId: 'user-123' },
      });
    });

    it('should return false if user has not liked the post', async () => {
      likesRepository.count.mockResolvedValue(0);

      const result = await service.hasUserLiked('post-123', 'user-123');

      expect(result).toBe(false);
    });
  });

  describe('getLikesCount', () => {
    it('should return the total likes count for a post', async () => {
      likesRepository.count.mockResolvedValue(42);

      const result = await service.getLikesCount('post-123');

      expect(result).toBe(42);
      expect(likesRepository.count).toHaveBeenCalledWith({
        where: { postId: 'post-123' },
      });
    });
  });
});
