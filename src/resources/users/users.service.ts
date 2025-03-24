import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '@common/database/entities';
import { Repository } from 'typeorm';
import { IRegistration } from '@common/models';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}

  async findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: string) {
    return this.usersRepository.findOne({
      where: { id },
    });
  }

  // async findByEmail(email: string) {
  //   return await this.usersRepository.findOne({ where: { email } });
  // }

  async update(id: string, updateData: IRegistration) {
    await this.usersRepository.update(id, updateData);
    return this.findOne(id);
  }

  async getFriends(userId: string) {
    return this.usersRepository.findOne({
      where: { id: userId },
      relations: ['friends'],
    });
  }

  async remove(id: string) {
    return this.usersRepository.delete(id);
  }
}
