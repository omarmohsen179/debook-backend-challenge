import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Post } from '../posts/entities/post.entity';
import { Like } from '../likes/entities/like.entity';
import { Comment } from '../posts/entities/comment.entity';

export const DatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST', 'localhost'),
  port: configService.get<number>('DATABASE_PORT', 5432),
  username: configService.get<string>('DATABASE_USER', 'debook_user'),
  password: configService.get<string>('DATABASE_PASSWORD', 'debook_password'),
  database: configService.get<string>('DATABASE_NAME', 'debook_db'),
  entities: [Post, Like, Comment],
  synchronize: configService.get<string>('TYPEORM_SYNCHRONIZE', 'false') === 'true',
  logging: configService.get<boolean>('TYPEORM_LOGGING', false),
  migrations: ['dist/database/migrations/*.js'],
  migrationsTableName: 'migrations',
});

// DataSource for migrations CLI
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USER || 'debook_user',
  password: process.env.DATABASE_PASSWORD || 'debook_password',
  database: process.env.DATABASE_NAME || 'debook_db',
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
};

export default new DataSource(dataSourceOptions);
