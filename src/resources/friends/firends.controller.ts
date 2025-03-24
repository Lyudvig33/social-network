import { FriendsService } from './firends.service';
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-firend.dto'
import { UpdateFriendDto } from './dto/update-firend.dto'

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post()
  create(@Body() createfriendDto: CreateFriendDto) {
    return this.friendsService.create(createfriendDto);
  }

  @Get()
  findAll() {
    return this.friendsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.friendsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatefriendDto: UpdateFriendDto) {
    return this.friendsService.update(+id, updatefriendDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.friendsService.remove(+id);
  }
}
