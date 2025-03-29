import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { UsersEntity } from './users.entity';
import { LikesEntity } from './likes.entity';
import { BaseEntity } from '../base';
import { CommentsEntity } from './comments.entity';
import { MediaType } from '@common/enums/file.types';

@Entity({ name: 'posts' })
export class PostsEntity extends BaseEntity {
  @Column({ type: 'text' })
  content?: string;

  @Column({
    name: 'media_type',
    type: 'enum',
    enum: MediaType,
    nullable: true,
  })
  mediaType: MediaType;

  @Column('text', { array: true, nullable: true })
  images?: string[];

  @Column({ type: 'text', nullable: true })
  video?: string;

  @ManyToOne(() => UsersEntity, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;

  @OneToMany(() => LikesEntity, (like) => like.post)
  likes: LikesEntity[];

  @OneToMany(() => CommentsEntity, (comment) => comment.post)
  comment: CommentsEntity[];
}
