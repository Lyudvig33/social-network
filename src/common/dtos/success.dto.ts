import { IMessageSuccess } from '@common/models-interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class SuccessDTO implements IMessageSuccess {
  @ApiProperty()
  @IsBoolean()
  success: boolean;
}
