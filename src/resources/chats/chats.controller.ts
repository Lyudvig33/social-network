import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Get,
  Patch,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { AuthUser } from '@common/decorators';
import { ITokenPayload } from '@common/models';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { AuthUserGuard } from '@common/guards';
import { ChatType } from '@common/enums';
import { AddMembersParamsDTO } from './dto/params.dto';

@ApiBearerAuth()
@UseGuards(AuthUserGuard)
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        chatType: {
          type: 'string',
          enum: [...Object.values(ChatType)],
          example: 'dm',
        },
        groupChatName: {
          type: 'string',
          example: 'My Cool Group Chat',
          nullable: true,
        },
        members: {
          type: 'array',
          items: { type: 'string', format: 'uuid' },
          example: ['1f2d3c4b-5e6f-7a8b-9c0d-1e2f3a4b5c6d'],
        },
      },
      required: ['chatType', 'members'],
    },
  })
  @ApiOperation({ summary: 'Create chat' })
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createChatDto: CreateChatDto,
    @AuthUser() user: ITokenPayload,
  ) {
    return this.chatsService.createChat(createChatDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get user chats' })
  @HttpCode(HttpStatus.OK)
  async getMyChats(@AuthUser() user: ITokenPayload) {
    return this.chatsService.getUserChats(user.id);
  }

  @Patch(':chatId/members/:userId')
  @ApiOperation({ summary: 'Add member to group chat' })
  @HttpCode(HttpStatus.CREATED)
  async addMember(
    @Param() params: AddMembersParamsDTO
  ) {
    return this.chatsService.addUsersToChat(params);
  }

  @Delete(':chatId/members/:userId')
  @ApiOperation({ summary: 'remove member from group chat' })
  @HttpCode(HttpStatus.OK)
  remove(@Param() params: AddMembersParamsDTO) {
    return this.chatsService.removeUserFromChat(params);
  }

  @Delete(':chatId')
  @ApiOperation({ summary: 'Delete chat' })
  @HttpCode(HttpStatus.OK)
  removeChat(@Param('chatId') chatId: string, @AuthUser() user: ITokenPayload) {
    return this.chatsService.deleteChat(user.id, chatId);
  }
}
