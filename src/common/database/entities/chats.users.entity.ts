import { Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base';
import { ChatsEntity } from './chats.entity';
import { UsersEntity } from './users.entity';

@Entity({ name: 'chat_members' })
@Index(['chat', 'user'], { unique: true })

export class ChatsUsersEntity extends BaseEntity {
  @ManyToOne(() => ChatsEntity, (chat) => chat.chatMembers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'chat_id' })
  chat: ChatsEntity;

  @ManyToOne(() => UsersEntity, (user) => user.chatMembers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'member_id' })
  user: UsersEntity;
}
