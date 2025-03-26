import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsEntity } from '@common/database/entities';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsEntity)
    private postRepository: Repository<PostsEntity>,
  ) {}

  async createPost(createPostDto: CreatePostDto,userId:string): Promise<PostsEntity> {
    const newPost =  await this.postRepository.create({...createPostDto, user: {id:userId}});
    return await this.postRepository.save(newPost)
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
    const post = await this.findOnePost(id)

    Object.assign(post,updatePostDto)
    return await this.postRepository.save(post)
  }

  async removePost(id: string): Promise<{message: string}> {
    const post =  await this.findOnePost(id)
    await this.postRepository.remove(post)

    return {message: 'Post successfully deleted'}
  }
}
