import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatsUsersService } from './chats-users.service';
import { CreateChatsUserDto } from './dto/create-chats-user.dto';
import { UpdateChatsUserDto } from './dto/update-chats-user.dto';

@Controller('chats-users')
export class ChatsUsersController {
  constructor(private readonly chatsUsersService: ChatsUsersService) {}

  @Post()
  create(@Body() createChatsUserDto: CreateChatsUserDto) {
    return this.chatsUsersService.create(createChatsUserDto);
  }

  @Get()
  findAll() {
    return this.chatsUsersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatsUsersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatsUserDto: UpdateChatsUserDto) {
    return this.chatsUsersService.update(+id, updateChatsUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatsUsersService.remove(+id);
  }
}
