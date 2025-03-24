import { PartialType } from '@nestjs/mapped-types';
import { CreateFriendDto } from './create-firend.dto';

export class UpdateFriendDto extends PartialType(CreateFriendDto) {}
