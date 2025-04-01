import { IMessages } from '@common/models/messages';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto implements IMessages { 
    @IsString()
    @IsNotEmpty()
    @ApiProperty({example: 'hello dear'})
    content: string;
}
