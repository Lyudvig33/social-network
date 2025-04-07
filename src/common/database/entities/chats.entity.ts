import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base';
import { MessagesEntity } from './messages.entity';
import { UsersEntity } from './users.entity';
import { ChatsUsersEntity } from './chats.users.entity';
import { ChatType } from '@common/enums';


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

  @Column({name: 'gruop_chat_name', nullable: true})
  groupChatName: string

  @OneToMany(() => MessagesEntity, (message) => message.chat)
  messages: MessagesEntity[];

  @OneToMany(() => ChatsUsersEntity, (member) => member.chat)
  chatMembers: ChatsUsersEntity[];
}
