import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { UsersEntity } from './users.entity';
import { LikesEntity } from './likes.entity';
import { BaseEntity } from '../base';
import { CommentsEntity } from './comments.entity';

export enum MediaType {
  photo = 'photo',
  video = 'video',
  text = 'text',
}

@Entity({ name: 'posts' })
export class PostsEntity extends BaseEntity {
  @Column({ type: 'text' })
  content: string;

  @Column({
    name: 'media_type',
    type: 'enum',
    enum: MediaType,
    default: 'text',
    nullable: true,
  })
  mediaType: MediaType;

  @Column({ name: 'media_url', nullable: true })
  url: string;

  @ManyToOne(() => UsersEntity, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;

  @OneToMany(() => LikesEntity, (like) => like.post)
  likes: LikesEntity[];

  @OneToMany(() => CommentsEntity, (comment) => comment.post)
  comment: CommentsEntity[];
}
