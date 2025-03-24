import { IId } from '@common/models';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class IdDTO implements IId {
  @ApiProperty()
  @IsNumber()
  id: string;
}
