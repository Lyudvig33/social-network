import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { AuthUser } from '@common/decorators';
import { ITokenPayload } from '@common/models';
import { AuthUserGuard } from '@common/guards';
import { MessagesEntity } from '@common/database/entities';
import { ApiOperation } from '@nestjs/swagger';

@UseGuards(AuthUserGuard)
@Controller('chats/:chatId/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @ApiOperation({ summary: 'send message' })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('chatId') chatId: string,
    @Body() createMessageDto: CreateMessageDto,
    @AuthUser() user: ITokenPayload,
  ): Promise<MessagesEntity> {
    return this.messagesService.sendMessage(chatId, createMessageDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'get messages' })
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Param('chatId') chatId: string,
    @AuthUser() user: ITokenPayload,
  ): Promise<MessagesEntity[]> {
    return this.messagesService.getMessages(user, chatId);
  }

  @Patch(':messageId')
  @ApiOperation({ summary: 'Edit message' })
  @HttpCode(HttpStatus.CREATED)
  update(
    @Param('chatId') chatId: string,
    @Param('messageId') messageId: string,
    @Body() updateMessageDto: UpdateMessageDto,
    @AuthUser() user: ITokenPayload,
  ) {
    return this.messagesService.updateMessage(
      updateMessageDto,
      chatId,
      user,
      messageId,
    );
  }

  @Delete(':messageId')
  @ApiOperation({ summary: 'delete message' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('chatId') chatId: string,
    @Param('messageId') messageId: string,
    @AuthUser() user: ITokenPayload,
  ) {
    return this.messagesService.removeMessage(chatId, user, messageId);
  }
}
