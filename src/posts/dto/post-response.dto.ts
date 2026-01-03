import { Post } from '../entities/post.entity';

export class PostResponseDto {
  id: string;
  content: string;
  authorId: string;
  likesCount: number;
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(post: Post, likesCount: number, commentsCount: number): PostResponseDto {
    return {
      id: post.id,
      content: post.content,
      authorId: post.authorId,
      likesCount,
      commentsCount,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }
}
