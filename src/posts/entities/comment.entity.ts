import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @Index('idx_comments_post_id')
  postId: string;

  @Column('uuid')
  @Index('idx_comments_user_id')
  userId: string;

  @Column('text')
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
