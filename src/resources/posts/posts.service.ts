import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {  PostsEntity} from '@common/database/entities';
import { Repository } from 'typeorm';
import { MediaType } from '@common/enums';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsEntity)
    private postRepository: Repository<PostsEntity>,
  ) {}

  async createPost(
    createPostDto: CreatePostDto,
    userId: string,
    images: string[],
    video: string | null,
  ): Promise<PostsEntity> {
    const { content, mediaType } = createPostDto;

    if (!content && images.length === 0 && !video) {
      throw new BadRequestException(
        'The post must contain text, photos or videos',
      );
    }

    if (mediaType === MediaType.photo && images.length === 0) {
      throw new BadRequestException(
        'The PHOTO post type requires at least one image.',
      );
    }

    if (mediaType === MediaType.video && !video) {
      throw new BadRequestException('Post type VIDEO requires a video file');
    }

    const newPost = new PostsEntity()
      Object.assign(newPost,{
      userId,
      content,
      mediaType,
      images,
      video,
    });
    return await this.postRepository.save(newPost);
  }


  async findAllPosts(): Promise<PostsEntity[]> {
    return await this.postRepository.find({
      relations: ['user', 'likes', 'comment'],
    });
  }

  async findOnePost(id: string): Promise<PostsEntity> {
    const post = this.postRepository.findOne({
      where: { id },
      relations: ['user', 'likes', 'comment'],
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async updatePost(id: string, updatePostDto: UpdatePostDto) {
    const post = await this.findOnePost(id);

    Object.assign(post, updatePostDto);
    return await this.postRepository.save(post);
  }

  async removePost(id: string): Promise<{ message: string }> {
    const post = await this.findOnePost(id);
    await this.postRepository.remove(post);

    return { message: 'Post successfully deleted' };
  }
}
