import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { PostsEntity } from './posts.entity';
import { UsersEntity } from './users.entity';
import { BaseEntity } from '../base';

@Entity({ name: 'likes' })
@Unique(['user', 'post'])
export class LikesEntity extends BaseEntity {
  @ManyToOne(() => PostsEntity, (posts) => posts.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: PostsEntity;

  @ManyToOne(() => UsersEntity, (user) => user.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;
}
