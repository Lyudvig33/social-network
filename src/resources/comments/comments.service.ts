import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentsEntity, PostsEntity } from '@common/database/entities';
import { DeepPartial, Repository } from 'typeorm';
import { ITokenPayload } from '@common/models';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsEntity)
    private commentsRepository: Repository<CommentsEntity>,
    @InjectRepository(PostsEntity)
    private postRepository: Repository<PostsEntity>,
  ) {}

  async createComment(
    createCommentDto: CreateCommentDto,
    postId: string,
    user: ITokenPayload,
  ): Promise<CommentsEntity> {
    const post = await this.postRepository.findOne({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comment = this.commentsRepository.create({
      content: createCommentDto.content,
      user,
      post,
    });

    return await this.commentsRepository.save(comment);
  }

  async findAllComments(): Promise<CommentsEntity[]> {
    return await this.commentsRepository.find();
  }

  async updateComment(
    commentId: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<CommentsEntity> {
    const comment = await this.commentsRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    this.commentsRepository.merge(
      comment,
      updateCommentDto as DeepPartial<CommentsEntity>,
    );

    return await this.commentsRepository.save(comment);
  }

  async removeComment(commentId: string) {
    const comment = await this.commentsRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    await this.commentsRepository.delete(commentId);

    return { message: 'comment successfully deleted' };
  }
}
