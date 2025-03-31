import { LikesEntity, PostsEntity } from '@common/database/entities';
import { ITokenPayload } from '@common/models';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(LikesEntity)
    private likeRepository: Repository<LikesEntity>,
    @InjectRepository(PostsEntity)
    private postsRepository: Repository<PostsEntity>,
  ) {}

  async likePost(
    postId: string,
    user: ITokenPayload,
  ): Promise<{ message: string }> {
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingLike = await this.likeRepository.findOne({
      where: { post: { id: postId }, user: { id: user.id } },
    });

    if (existingLike) {
      throw new BadRequestException('User already likes this post');
    }

    const like = this.likeRepository.create({ post, user });
    await this.likeRepository.save(like);

    return { message: 'Post like successfully' };
  }

  async findAll(): Promise<LikesEntity[]> {
    return await this.likeRepository.find();
  }

  async unLikePost(
    postId: string,
    user: ITokenPayload,
  ): Promise<{ message: string }> {
    const like = await this.likeRepository.findOne({
      where: { post: { id: postId }, user: { id: user.id } },
    });
    await this.likeRepository.delete(like.id);

    return { message: 'like removed ' };
  }
}
