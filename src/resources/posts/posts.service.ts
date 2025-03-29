import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsEntity, UsersEntity } from '@common/database/entities';
import { Repository } from 'typeorm';
import { MediaType } from '@common/enums';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsEntity)
    private postRepository: Repository<PostsEntity>,
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
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

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const newPost = this.postRepository.create({
      ...createPostDto,
      user,
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

  async updatePost(
    postId: string,
    updatePostDto: UpdatePostDto,
    userId: string,
    images?: [],
    video?: string,
  ): Promise<PostsEntity> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException('Post Not Found');
    }

    if (post.user.id !== userId) {
      throw new ForbiddenException('You can only edit your own posts');
    }

    if (
      !updatePostDto.content &&
      (!images || images.length === 0) &&
      (!video || video.length === 0)
    ) {
      throw new BadRequestException(
        'The post must contain text, photos, or videos',
      );
    }

    if (
      updatePostDto.mediaType === MediaType.photo &&
      (!images || images.length === 0)
    ) {
      throw new BadRequestException(
        'The PHOTO post type requires at least one image.',
      );
    }

    if (updatePostDto.mediaType === MediaType.video && !video) {
      throw new BadRequestException('Post type VIDEO requires a video file');
    }

    Object.assign(post, updatePostDto);
    if (images !== undefined) post.images = images;
    if (video !== undefined) post.video = video;

    return await this.postRepository.save(post);
  }

  async removePost(id: string): Promise<{ message: string }> {
    const post = await this.findOnePost(id);
    await this.postRepository.remove(post);

    return { message: 'Post successfully deleted' };
  }
}
