import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base';
import { UsersEntity } from './users.entity';
import { PostsEntity } from './posts.entity';

@Entity({ name: 'comments' })
export class CommentsEntity extends BaseEntity {
  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => UsersEntity, (user) => user.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;

  @ManyToOne(() => PostsEntity, (post) => post.comment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: PostsEntity;
}
