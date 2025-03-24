import { Injectable } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-firend.dto';
import { UpdateFriendDto } from './dto/update-firend.dto';

@Injectable()
export class FriendsService {
  create(createFirendDto: CreateFriendDto) {
    return 'This action adds a new firend';
  }

  findAll() {
    return `This action returns all firends`;
  }

  findOne(id: number) {
    return `This action returns a #${id} firend`;
  }

  update(id: number, updateFirendDto: UpdateFriendDto) {
    return `This action updates a #${id} firend`;
  }

  remove(id: number) {
    return `This action removes a #${id} firend`;
  }
}
