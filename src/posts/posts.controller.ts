import { Controller, Get, Param } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostResponseDto } from './dto/post-response.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PostResponseDto> {
    return await this.postsService.findOne(id);
  }
}
