import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../config/database.config';

async function seed() {
  const dataSource = new DataSource(dataSourceOptions);
  await dataSource.initialize();

  console.log('🌱 Starting database seeding...');

  try {
    // Create sample posts
    const postIds = [];
    for (let i = 1; i <= 5; i++) {
      const result = await dataSource.query(
        `INSERT INTO posts (content, author_id) 
         VALUES ($1, $2) 
         RETURNING id`,
        [
          `This is test post #${i} for the Debook challenge`,
          `author-${i % 2 === 0 ? 1 : 2}-uuid`,
        ],
      );
      postIds.push(result[0].id);
      console.log(`✅ Created post: ${result[0].id}`);
    }

    // Create sample comments
    for (const postId of postIds) {
      for (let i = 1; i <= 3; i++) {
        await dataSource.query(
          `INSERT INTO comments (post_id, user_id, content) 
           VALUES ($1, $2, $3)`,
          [postId, `commenter-${i}-uuid`, `This is comment #${i}`],
        );
      }
      console.log(`✅ Created 3 comments for post: ${postId}`);
    }

    console.log('\n🎉 Seeding completed successfully!\n');
    console.log('Sample Post IDs:');
    postIds.forEach((id, index) => {
      console.log(`  Post ${index + 1}: ${id}`);
    });
    console.log('\nYou can now test the API with these post IDs!');
    console.log('\nExample commands:');
    console.log(`  curl http://localhost:3000/v1/posts/${postIds[0]}`);
    console.log(`  curl -X POST http://localhost:3000/v1/posts/${postIds[0]}/like -H "x-user-id: test-user-123"`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

seed();
