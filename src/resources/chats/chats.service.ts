import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { ITokenPayload } from '@common/models';
import { ChatType } from '@common/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatsEntity, ChatsUsersEntity } from '@common/database/entities';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { AddMembersParamsDTO } from './dto/params.dto';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(ChatsEntity)
    private chatsRepository: Repository<ChatsEntity>,
    @InjectRepository(ChatsUsersEntity)
    private chatsUsersRepository: Repository<ChatsUsersEntity>,
  ) {}

  async doesDmChatExist(userId1: string, userId2: string): Promise<boolean> {
    const existingChat = await this.chatsRepository.findOne({
      where: { chatType: ChatType.Dm },
      relations: ['chatMembers', 'chatMembers.user'],
    });

    if (!existingChat) return false;

    const membersId = existingChat.chatMembers.map((m) => m.user.id);
    return membersId.includes(userId1) && membersId.includes(userId2);
  }

  async addUsersToChat(params: AddMembersParamsDTO) {
    const { chatId, userId } = params;

    const chat = await this.chatsRepository.findOne({
      where: { id: chatId },
      relations: ['chatMembers', 'chatMembers.user'],
    });

    if (!chat) {
      throw new BadRequestException('Chat Not Found');
    }

    const isAlreadyMember = chat.chatMembers.some(
      (member) => member.user.id === userId,
    );
    if (isAlreadyMember) {
      throw new BadRequestException('User is already a member of this chat');
    }

    await this.chatsUsersRepository.save({
      chat: { id: chatId },
      user: { id: userId },
    });
  }
  async removeUserFromChat(params: AddMembersParamsDTO) {
    const { chatId, userId } = params;
    const member = await this.chatsUsersRepository.findOne({
      where: { chat: { id: chatId }, user: { id: userId } },
    });

    if (!member)
      throw new NotFoundException('User is not a member of this chat');

    return await this.chatsUsersRepository.remove(member);
  }

  async getUserChats(userId: string): Promise<ChatsEntity[]> {
    const chats = await this.chatsRepository.find({
      relations: ['chatMembers', 'chatMembers.user', 'owner'],
      where: {
        chatMembers: {
          user: { id: userId },
        },
      },
    });
    return chats;
  }

  @Transactional()
  async createChat(
    createChatDto: CreateChatDto,
    user: ITokenPayload,
  ): Promise<ChatsEntity> {
    const { chatType, members, groupChatName } = createChatDto;

    if (!members || members.length === 0) {
      throw new BadRequestException('Members list cannot be empty');
    }

    if (chatType === ChatType.Dm) {
      if (members.length !== 1) {
        throw new BadRequestException(
          'DM chat can only have one member besides the owner',
        );
      }
      

      const alreadyExists = await this.doesDmChatExist(user.id, members[0]);
      if (alreadyExists) {
        throw new BadRequestException('DM chat already exists');
      }
    }


    if (chatType === ChatType.GroupChat) {
      if (members.length < 2) {
        throw new BadRequestException(
          'Group chat must have at least two members besides the owner',
        );
      }
    }

    const chat = await this.chatsRepository.save({
      chatType,
      groupChatName,
      owner: { id: user.id },
    });

    const allMembersIds = Array.from(new Set([user.id, ...members]));

    const insertPromises = allMembersIds.map((memberId) => {
      return this.chatsUsersRepository.save({
        chat: { id: chat.id },
        user: { id: memberId },
      });
    });

    await Promise.all(insertPromises);

    return chat;
  }

  async deleteChat(ownerId: string, chatId: string) {
    const chat = await this.chatsRepository.findOne({
      where: { id: chatId, owner: { id: ownerId } },
      relations: ['owner', 'chatMembers'],
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    return await this.chatsRepository.remove(chat);
  }
}
