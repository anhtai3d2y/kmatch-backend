import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { CreatePermissionDto } from './dto/createPermission.dto';
import { UpdatePermissionDto } from './dto/updatePermission.dto';
import { PermissionService } from './permission.service';
import { Response } from '../../utils/response';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guard/roles.guard';
import { ActionEnum } from '../../utils/constants/enum/action.enum';
import { Permission } from '../../common/decorators/roles.decorator';

@ApiTags('permission2')
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @ApiOperation({ summary: 'Get all Permision ' })
  // @Permission(ActionEnum.getPermission)
  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async getPermissions(): Promise<Response> {
    try {
      const permissions: any = await this.permissionService.getAllPermission();
      return {
        statusCode: HttpStatus.OK,
        message: 'Get list Permission successfully!',
        data: permissions,
      };
    } catch (e) {
      return {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'Get list Permission failed!',
        data: '',
      };
    }
  }

  @ApiOperation({ summary: 'Get Permission by Id ' })
  // @Permission(ActionEnum.getPermission)
  @ApiParam({ required: true, name: 'id', example: '6094dc6f51d62f00365ed928' })
  @Get(':id')
  async getPermission(@Param('id') id): Promise<Response> {
    try {
      const permission = await this.permissionService.getPermissionBydID(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Get item Permission successfully!',
        data: permission,
      };
    } catch (e) {
      const message = e.response.message;
      let messageError: any = message;
      if (e.response.error === 'ID_NOT_FOUND') {
        messageError = message;
      } else if (e.response.error === 'ID_NOT_VALID') {
        messageError = message;
      } else {
        messageError = 'A system error has occurred!';
      }
      return {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: messageError,
        error: 'Unprocessable Entity',
      };
    }
  }

  @ApiOperation({ summary: 'Create Permission' })
  @ApiBody({
    type: CreatePermissionDto,
    required: true,
    description: 'Create new permission',
  })
  @Post('/')
  // @Permission(ActionEnum.createPermission)
  async createPermission(@Body() per: CreatePermissionDto): Promise<Response> {
    try {
      const result = await this.permissionService.createPermission(per);
      return {
        statusCode: HttpStatus.OK,
        message: 'Create item successfully',
        data: result,
      };
    } catch (e) {
      const message = e.message;
      let messageError: any = message;
      if (e.name === 'ValidationError') {
        messageError = message;
      } else if (e.response.error === 'Conflict') {
        messageError = message;
      } else {
        messageError = 'A system error has occurred!';
      }
      return {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: messageError,
        error: 'Unprocessable Entity',
      };
    }
  }

  @Put(':id')
  // @Permission(ActionEnum.updatePermission)
  async updatePermission(
    @Param('id') id: string,
    @Body() per: UpdatePermissionDto,
  ): Promise<Response> {
    try {
      const result = await this.permissionService.updatePermission(id, per);
      return {
        statusCode: HttpStatus.OK,
        message: 'Update item successfully',
        data: result,
      };
    } catch (e) {
      const message = e.response.message;
      let messageError: any = message;
      if (e.response.error === 'ID_NOT_FOUND') {
        messageError = message;
      } else if (e.response.error === 'ID_NOT_VALID') {
        messageError = message;
      } else if (e.response.error === 'Conflict') {
        messageError = message;
      } else {
        messageError = 'A system error has occurred!';
      }
      return {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: messageError,
        error: 'Unprocessable Entity',
      };
    }
  }

  @ApiOperation({ summary: 'Delete Permission by Id ' })
  // @Permission(ActionEnum.deletePermission)
  @ApiParam({ required: true, name: 'id', example: '6094dc6f51d62f00365ed928' })
  @Delete(':id')
  async deletePermissionByID(@Param('id') id: string): Promise<Response> {
    try {
      const result = await this.permissionService.deletePermissionById(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Delete item successfully',
        data: result,
      };
    } catch (e) {
      const message = e.response.message;
      let messageError: any = message;
      if (e.response.error === 'ID_NOT_FOUND') {
        messageError = message;
      } else if (e.response.error === 'ID_NOT_VALID') {
        messageError = message;
      } else {
        messageError = 'A system error has occurred!';
      }
      return {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: messageError,
        error: 'Unprocessable Entity',
      };
    }
  }
}
