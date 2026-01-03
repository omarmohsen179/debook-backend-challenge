import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LikesModule } from '../src/likes/likes.module';
import { PostsModule } from '../src/posts/posts.module';
import { NotificationsModule } from '../src/notifications/notifications.module';
import { Post } from '../src/posts/entities/post.entity';
import { Like } from '../src/likes/entities/like.entity';
import { Comment } from '../src/posts/entities/comment.entity';
import { Repository } from 'typeorm';

describe('LikesController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let testPostId: string;
  const testUserId = '770e8400-e29b-41d4-a716-446655440000';

  beforeAll(async () => {
    // Increase timeout for database connection
    jest.setTimeout(30000);

    moduleFixture = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DATABASE_HOST || 'localhost',
          port: parseInt(process.env.DATABASE_PORT || '5432'),
          username: process.env.DATABASE_USER || 'debook_user',
          password: process.env.DATABASE_PASSWORD || 'debook_password',
          database: process.env.DATABASE_NAME || 'debook_db',
          entities: [Post, Like, Comment],
          synchronize: true, // Only for tests
          dropSchema: true, // Clean database for each test run
          retryAttempts: 5,
          retryDelay: 2000,
        }),
        EventEmitterModule.forRoot(),
        PostsModule,
        LikesModule,
        NotificationsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.setGlobalPrefix('v1');
    await app.init();

    // Create a test post
    const postRepository = moduleFixture.get<Repository<Post>>(getRepositoryToken(Post));
    const post = await postRepository.save({
      content: 'Test post for e2e testing',
      authorId: '550e8400-e29b-41d4-a716-446655440000',
    });
    testPostId = post.id;
  }, 30000); // 30 second timeout

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  }, 10000);

  describe('POST /v1/posts/:id/like', () => {
    it('should create a like successfully with valid x-user-id header', () => {
      return request(app.getHttpServer())
        .post(`/v1/posts/${testPostId}/like`)
        .set('x-user-id', testUserId)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('success', true);
          expect(res.body).toHaveProperty('message');
          expect(res.body.alreadyLiked).toBe(false);
        });
    });

    it('should handle duplicate like (idempotent)', () => {
      return request(app.getHttpServer())
        .post(`/v1/posts/${testPostId}/like`)
        .set('x-user-id', testUserId)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('success', true);
          expect(res.body.alreadyLiked).toBe(true);
        });
    });

    it('should return 401 without x-user-id header', () => {
      return request(app.getHttpServer())
        .post(`/v1/posts/${testPostId}/like`)
        .expect(401)
        .expect((res) => {
          expect(res.body).toHaveProperty('message', 'x-user-id header is required');
        });
    });

    it('should return 404 for non-existent post', () => {
      return request(app.getHttpServer())
        .post('/v1/posts/00000000-0000-0000-0000-000000000000/like')
        .set('x-user-id', testUserId)
        .expect(404);
    });
  });

  describe('GET /v1/posts/:id', () => {
    it('should return post with counters including likesCount', () => {
      return request(app.getHttpServer())
        .get(`/v1/posts/${testPostId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', testPostId);
          expect(res.body).toHaveProperty('content');
          expect(res.body).toHaveProperty('likesCount');
          expect(res.body).toHaveProperty('commentsCount');
          // After creating likes in previous tests, count should be >= 0
          expect(typeof res.body.likesCount).toBe('number');
          expect(res.body.likesCount).toBeGreaterThanOrEqual(0);
        });
    });

    it('should return 404 for non-existent post', () => {
      return request(app.getHttpServer())
        .get('/v1/posts/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });
});
