import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  Unique,
} from 'typeorm';

@Entity('likes')
@Unique('unique_post_user_like', ['postId', 'userId'])
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @Index('idx_likes_post_id')
  postId: string;

  @Column('uuid')
  @Index('idx_likes_user_id')
  userId: string;

  @CreateDateColumn()
  createdAt: Date;
}
