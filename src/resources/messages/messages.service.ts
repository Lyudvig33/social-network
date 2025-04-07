import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { MessagesParamsDto } from './dto/params.dto';

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

    const chat = await this.chatsRepository.findOne({
      where: { id: chatId, chatMembers: { user: { id: user.id } } },
    });
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    const message = this.messagesRepository.create({
      content,
      user,
      chat,
    });

    return await this.messagesRepository.save(message);
  }

  async getMessages(
    user: ITokenPayload,
    chatId: string,
  ): Promise<MessagesEntity[]> {
    const chat = await this.chatsRepository.findOne({
      where: { id: chatId, chatMembers: { user: { id: user.id } } },
    });
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    return await this.messagesRepository.find({
      where: { chat: { id: chatId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateMessage(
    updateMessageDto: UpdateMessageDto,
    user: ITokenPayload,
    params: MessagesParamsDto,
  ): Promise<MessagesEntity> {

    const { messageId, chatId } = params;
    
    const message = await this.messagesRepository.findOne({
      where: { id: messageId, chat: { id: chatId }, user: { id: user.id } },
      relations: ['user', 'chat'],
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return await this.messagesRepository.save({
      id: message.id,
      content: updateMessageDto.content,
    });
  }

  async removeMessage(
    user: ITokenPayload,
    params: MessagesParamsDto,
  ): Promise<{ message: string }> {
    const { messageId, chatId } = params;
    const message = await this.messagesRepository.findOne({
      where: { id: messageId, chat: { id: chatId } },
      relations: ['user', 'chat'],
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.user.id !== user.id) {
      throw new ForbiddenException('You can only delete your own message');
    }

    const isMember = await this.chatUsersRepository.findOne({
      where: { chat: { id: chatId }, user: { id: user.id } },
    });

    if (!isMember) {
      throw new ForbiddenException('You are not a member of this chat');
    }

    await this.messagesRepository.delete(message.id);
    return { message: 'Message deleted' };
  }
}
