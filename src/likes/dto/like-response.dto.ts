export class LikeResponseDto {
  success: boolean;
  message: string;
  alreadyLiked?: boolean;

  static success(alreadyLiked: boolean = false): LikeResponseDto {
    return {
      success: true,
      message: alreadyLiked 
        ? 'Post already liked by this user' 
        : 'Like created successfully',
      alreadyLiked,
    };
  }
}
