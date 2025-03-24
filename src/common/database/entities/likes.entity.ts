import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PostsEntity } from './posts.entity';
import { UsersEntity } from './users.entity';
import { BaseEntity } from '../base';

@Entity({ name: 'likes' })
export class LikesEntity extends BaseEntity {
  @ManyToOne(() => PostsEntity, (posts) => posts.likes)
  @JoinColumn({ name: 'post_id' })
  post: PostsEntity;

  @ManyToOne(() => UsersEntity, (user) => user.likes)
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;
}
