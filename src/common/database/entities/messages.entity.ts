import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UsersEntity } from './users.entity';
import { BaseEntity } from '../base';
import { ChatsEntity } from './chats.entity';

@Entity({ name: 'messages' })
export class MessagesEntity extends BaseEntity {
  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => UsersEntity, (user) => user.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;

  @ManyToOne(() => ChatsEntity, (chat) => chat.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'chat_id' })
  chat: ChatsEntity;
}
