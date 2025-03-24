import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base';
import { MessagesEntity } from './messages.entity';
import { UsersEntity } from './users.entity';
import { ChatsUsersEntity } from './chats.users.entity';

export enum ChatType {
  GroupChat = 'groupChat',
  Dm = 'dm',
}

@Entity({ name: 'chats' })
export class ChatsEntity extends BaseEntity {
  @ManyToOne(() => UsersEntity, (user) => user.ownedChats, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'owner_id' })
  owner: UsersEntity;

  @Column({
    name: 'chat_type',
    type: 'enum',
    enum: ChatType,
    default: ChatType.Dm,
  })
  chatType: ChatType;

  @OneToMany(() => MessagesEntity, (message) => message.chat)
  messages: MessagesEntity[];

  @OneToMany(() => ChatsUsersEntity, (member) => member.chat)
  chatMembers: ChatsUsersEntity[];
}
