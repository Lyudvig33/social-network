import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ChatsEntity,
  ChatsUsersEntity,
  MessagesEntity,
} from '@common/database/entities';
import { Repository } from 'typeorm';
import { ITokenPayload } from '@common/models';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessagesEntity)
    private messagesRepository: Repository<MessagesEntity>,

    @InjectRepository(ChatsEntity)
    private chatsRepository: Repository<ChatsEntity>,

    @InjectRepository(ChatsUsersEntity)
    private chatUsersRepository: Repository<ChatsUsersEntity>,
  ) {}

  async sendMessage(
    chatId: string,
    createMessageDto: CreateMessageDto,
    user: ITokenPayload,
  ): Promise<MessagesEntity> {
    const { content } = createMessageDto;

    const chat = await this.chatsRepository.findOne({ where: { id: chatId } });
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    const isMember = await this.chatUsersRepository.findOne({
      where: { chat: { id: chatId }, user: { id: user.id } },
    });

    if (!isMember) {
      throw new ForbiddenException('You are not a member of this chat');
    }

    const message = this.messagesRepository.create({
      content,
      user,
      chat,
    });

    return await this.messagesRepository.save(message);
  }

  async getMessages(user: ITokenPayload, chatId: string): Promise<MessagesEntity[]> {
    const chat = await this.chatsRepository.findOne({ where: { id: chatId } });
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    const isMember = await this.chatUsersRepository.findOne({
      where: { chat: { id: chatId }, user: { id: user.id } },
    });

    if (!isMember) {
      throw new ForbiddenException('You are not a member of this chat');
    }

    return await this.messagesRepository.find({
      where:{chat: {id: chatId}},
      relations: ['user'],
      order: {createdAt: 'ASC'}
    })

  } 

  async updateMessage(updateMessageDto: UpdateMessageDto, id: string,user: ITokenPayload ): Promise<MessagesEntity> {
    const message = await this.messagesRepository.findOne({ where: {id},relations: ['user'] });

    if (!message) {
      throw new NotFoundException( 'Message not found')
    }

    if (message.user.id !== user.id) {
      throw new BadRequestException('You can only edit your own  message')
    }
    Object.assign(message,updateMessageDto);

    return await this.messagesRepository.save(message)
  }
  
  remove(id: string) {}
}
