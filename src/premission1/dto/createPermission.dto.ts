import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty } from 'class-validator';
import { ActionEnum } from '../../../utils/constants/enum/action.enum';

export class CreatePermissionDto {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'Search User',
    description: 'Your permision',
  })
  permissionName: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'search_User',
    description: 'Your description',
  })
  // @IsIn(Object.values(ActionEnum), {
  //   message: Object.values(ActionEnum).toString(),
  // })
  permissionCode: string;
}
