import { Injectable } from '@nestjs/common';
import { CreateChatsUserDto } from './dto/create-chats-user.dto';
import { UpdateChatsUserDto } from './dto/update-chats-user.dto';

@Injectable()
export class ChatsUsersService {
  create(createChatsUserDto: CreateChatsUserDto) {
    return 'This action adds a new chatsUser';
  }

  findAll() {
    return `This action returns all chatsUsers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chatsUser`;
  }

  update(id: number, updateChatsUserDto: UpdateChatsUserDto) {
    return `This action updates a #${id} chatsUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatsUser`;
  }
}
