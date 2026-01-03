import { Controller, Post, Param, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { UserIdGuard } from '../common/guards/user-id.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { LikeResponseDto } from './dto/like-response.dto';

@Controller('posts')
@UseGuards(UserIdGuard)
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post(':id/like')
  async createLike(
    @Param('id') postId: string,
    @CurrentUser() userId: string,
  ): Promise<LikeResponseDto> {
    return await this.likesService.createLike(postId, userId);
  }
}
