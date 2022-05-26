import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { ActionEnum } from '../../../utils/constants/enum/action.enum';

export class UpdatePermissionDto {
  @IsOptional()
  @ApiProperty({
    type: String,
    example: 'Student manager',
    description: 'Your permision',
  })
  permissionName: string;

  @IsOptional()
  @ApiProperty({
    type: String,
    example: 'Your permissionCode',
    description: 'Your permissionCode',
  })
  @IsIn(Object.values(ActionEnum), {
    message: Object.values(ActionEnum).toString(),
  })
  permissionCode: string;
}
