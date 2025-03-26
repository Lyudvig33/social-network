import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '@common/database/entities';
import { Repository } from 'typeorm';


@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
  ) {}

  async AddFriend(userId: string, friendId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['friends'],
    });

    const friend = await this.userRepository.findOne({
      where: { id: friendId },
    });

    if (!user || !friend) {
      throw new NotFoundException('User not found');
    }

    if (user.friends.some((f) => f.id === friendId)) {
      throw new BadRequestException('Already friends');
    }

    user.friends.push(friend);
    await this.userRepository.save(user);
    return { message: 'Friend added successfully',friend};
  }

  async getFriends(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['friends'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.friends
  }

  async removeFriend(userid: string, friendId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userid },
      relations: ['friends'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.friends = user.friends.filter((friend) => friend.id !== friendId);
    await this.userRepository.save(user);
    return { message: 'Friend removed successfully' };
  }
}
