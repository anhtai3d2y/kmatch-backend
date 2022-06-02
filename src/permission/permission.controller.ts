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
import { I18n, I18nContext } from 'nestjs-i18n';
import { RolesGuard } from '../../common/guard/roles.guard';
import { ActionEnum } from '../../utils/constants/enum/action.enum';
import { Permission } from '../../common/decorators/roles.decorator';

@Controller('permission')
@ApiTags('permission')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @ApiOperation({ summary: 'Get all Permision ' })
  @Permission(ActionEnum.getPermission)
  @Get()
  async getPermissions(@I18n() i18n: I18nContext): Promise<Response> {
    try {
      const permissions: any = await this.permissionService.getAllPermission();
      return {
        statusCode: HttpStatus.OK,
        message: await i18n.translate('common.GET_LIST_SUCCESSFULLY', {
          args: { property: 'Permission' },
        }),
        data: permissions,
      };
    } catch (e) {
      return {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: await i18n.translate('common.GET_LIST_FAILED', {
          args: { property: 'Permission' },
        }),
        data: '',
      };
    }
  }

  @ApiOperation({ summary: 'Get Permission by Id ' })
  @Permission(ActionEnum.getPermission)
  @ApiParam({ required: true, name: 'id', example: '6094dc6f51d62f00365ed928' })
  @Get(':id')
  async getPermission(
    @Param('id') id,
    @I18n() i18n: I18nContext,
  ): Promise<Response> {
    try {
      const permission = await this.permissionService.getPermissionBydID(id);
      return {
        statusCode: HttpStatus.OK,
        message: await i18n.translate('common.GET_ITEM_SUCCESSFULLY', {
          args: { property: 'Permission' },
        }),
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
        messageError = 'common.SYSTEM_ERROR';
      }
      return {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: await i18n.translate(messageError, {
          args: { property: 'Permission' },
        }),
        error: await i18n.translate('validation.UNPROCESSABLE_ENTITY'),
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
  @Permission(ActionEnum.createPermission)
  async createPermission(
    @Body() per: CreatePermissionDto,
    @I18n() i18n: I18nContext,
  ): Promise<Response> {
    try {
      const result = await this.permissionService.createPermission(per);
      return {
        statusCode: HttpStatus.OK,
        message: await i18n.translate('common.CREATE_ITEM_SUCCESSFULLY', {
          args: { property: 'Permission' },
        }),
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
        messageError = 'common.SYSTEM_ERROR';
      }
      return {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: await i18n.translate(messageError, {
          args: { property: 'Permission' },
        }),
        error: await i18n.translate('validation.UNPROCESSABLE_ENTITY'),
      };
    }
  }

  @Put(':id')
  @Permission(ActionEnum.updatePermission)
  async updatePermission(
    @Param('id') id: string,
    @Body() per: UpdatePermissionDto,
    @I18n() i18n: I18nContext,
  ): Promise<Response> {
    try {
      const result = await this.permissionService.updatePermission(id, per);
      return {
        statusCode: HttpStatus.OK,
        message: await i18n.translate('common.UPDATE_ITEM_SUCCESSFULLY', {
          args: { property: 'Permission' },
        }),
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
        messageError = 'common.SYSTEM_ERROR';
      }
      return {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: await i18n.translate(messageError, {
          args: { property: 'Permission' },
        }),
        error: await i18n.translate('validation.UNPROCESSABLE_ENTITY'),
      };
    }
  }

  @ApiOperation({ summary: 'Delete Permission by Id ' })
  @Permission(ActionEnum.deletePermission)
  @ApiParam({ required: true, name: 'id', example: '6094dc6f51d62f00365ed928' })
  @Delete(':id')
  async deletePermissionByID(
    @Param('id') id: string,
    @I18n() i18n: I18nContext,
  ): Promise<Response> {
    try {
      const result = await this.permissionService.deletePermissionById(id);
      return {
        statusCode: HttpStatus.OK,
        message: await i18n.translate('common.DELETE_ITEM_SUCCESSFULLY', {
          args: { property: 'Permission' },
        }),
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
        messageError = 'common.SYSTEM_ERROR';
      }
      return {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: await i18n.translate(messageError, {
          args: { property: 'Permission' },
        }),
        error: await i18n.translate('validation.UNPROCESSABLE_ENTITY'),
      };
    }
  }
}
