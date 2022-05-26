import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty } from 'class-validator';
import { ActionEnum } from '../../../utils/constants/enum/action.enum';

export class CreatePermissionDto {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'Student manager',
    description: 'Your permision',
  })
  permissionName: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'Your description',
    description: 'Your description',
  })
  @IsIn(Object.values(ActionEnum), {
    message: Object.values(ActionEnum).toString(),
  })
  permissionCode: string;
}
