import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { PostsEntity } from './posts.entity';
import { MessagesEntity } from './messages.entity';
import { LikesEntity } from './likes.entity';
import { BaseEntity } from '../base';
import { CommentsEntity } from './comments.entity';
import { ChatsEntity } from './chats.entity';
import { ChatsUsersEntity } from './chats.users.entity';

@Entity({ name: 'users' })
export class UsersEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @OneToMany(() => PostsEntity, (post) => post.user, { cascade: true })
  posts: PostsEntity[];

  @OneToMany(() => MessagesEntity, (message) => message.user, { cascade: true })
  messages: MessagesEntity[];

  @OneToMany(() => LikesEntity, (like) => like.user, { cascade: true })
  likes: LikesEntity[];

  @OneToMany(() => CommentsEntity, (comment) => comment.user, { cascade: true })
  comments: CommentsEntity[];

  @OneToMany(() => ChatsUsersEntity, (member) => member.user)
  chatMembers: ChatsUsersEntity[];

  @OneToMany(() => ChatsEntity, (chat) => chat.owner)
  ownedChats: ChatsEntity[];

  @ManyToMany(() => UsersEntity, (user) => user.friends,{nullable: false})
  @JoinTable({
    name: 'user_friends',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'friend_id', referencedColumnName: 'id' },
  })
  friends: UsersEntity[];
}
