import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsMongoId, IsString, IsOptional } from 'class-validator';
import { MessageType } from 'utils/constants/enum/messageType.enum';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  @ApiProperty({
    type: String,
    description: 'threadId',
    example: '627e17990d52eb29d86831cd',
  })
  threadId: string;

  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  @ApiProperty({
    type: String,
    description: 'receiverId',
    example: '62846ff7dc8f605051b07c73',
  })
  receiverId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'messageType',
    enum: MessageType,
    default: MessageType.Text,
  })
  messageType: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'messageBody',
  })
  messageBody: string;
}

export class CreateMessageImageDto {
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  @ApiProperty({
    type: String,
    description: 'threadId',
    example: '627e17990d52eb29d86831cd',
  })
  threadId: string;

  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  @ApiProperty({
    type: String,
    description: 'receiverId',
    example: '62846ff7dc8f605051b07c73',
  })
  receiverId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'messageType',
    enum: MessageType,
    default: MessageType.Text,
  })
  messageType: string;

  @ApiProperty({
    type: String,
    format: 'binary',
    description: 'image',
    required: false,
  })
  @IsOptional()
  image?: string;
}
