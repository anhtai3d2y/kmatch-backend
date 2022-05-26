import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { GroupPermissionService } from './group-permission.service';
import { Response } from '../../utils/response';
import { CreateGroupPermissionDto } from './dto/createGroupPermission.dto';
import { UpdateGroupPermissionDto } from './dto/updateGroupPermission.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { RolesGuard } from '../../common/guard/roles.guard';
import { ActionEnum } from '../../utils/constants/enum/action.enum';
import { Permission } from '../../common/decorators/roles.decorator';

@Controller('group-permission')
@ApiTags('group-permission')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class GroupPermissionController {
  constructor(
    private readonly groupPermissionService: GroupPermissionService,
  ) {}

  // @Get()
  // @Permission(ActionEnum.getGroupPermission)
  // @ApiOperation({ summary: 'Get all group permission' })
  // // @UseInterceptors(CacheInterceptor)
  // async getAllGroupPermission(@I18n() i18n: I18nContext): Promise<Response> {
  //   try {
  //     const result = await this.groupPermissionService.getAllGroupPermission();
  //     return {
  //       statusCode: HttpStatus.OK,
  //       message: await i18n.translate('common.GET_LIST_SUCCESSFULLY', {
  //         args: { property: 'group permission' },
  //       }),
  //       data: result,
  //     };
  //   } catch (e) {
  //     return {
  //       statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  //       message: await i18n.translate('common.GET_LIST_FAILED', {
  //         args: { property: 'group permission' },
  //       }),
  //       error: await i18n.translate('validation.UNPROCESSABLE_ENTITY'),
  //     };
  //   }
  // }

  @Permission(ActionEnum.getGroupPermission)
  @ApiOperation({ summary: 'Get GroupPermission by Id' })
  @ApiParam({ required: true, name: 'id', example: '6094dc6f51d62f00365ed928' })
  @Get(':id')
  async getPermission(
    @Param('id') id,
    @I18n() i18n: I18nContext,
  ): Promise<Response> {
    try {
      const gP = await this.groupPermissionService.getGroupPermissionBydID(id);
      return {
        statusCode: HttpStatus.OK,
        message: await i18n.translate('common.GET_ITEM_SUCCESSFULLY', {
          args: { property: 'group permission' },
        }),
        data: gP,
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
          args: { property: 'group permission' },
        }),
        error: await i18n.translate('validation.UNPROCESSABLE_ENTITY'),
      };
    }
  }

  @Permission(ActionEnum.createGroupPermission)
  @ApiOperation({ summary: 'Create Group Permission' })
  @ApiBody({
    type: CreateGroupPermissionDto,
    required: true,
    description: 'Create new Group permission',
  })
  @Post('/')
  async createGroupPermission(
    @Body() gP: CreateGroupPermissionDto,
    @I18n() i18n: I18nContext,
  ): Promise<Response> {
    try {
      const result = await this.groupPermissionService.createGroupPermission(
        gP,
      );
      return {
        statusCode: HttpStatus.OK,
        message: await i18n.translate('common.CREATE_ITEM_SUCCESSFULLY', {
          args: { property: 'group permission' },
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
          args: { property: 'group permission' },
        }),
        error: await i18n.translate('validation.UNPROCESSABLE_ENTITY'),
      };
    }
  }

  @Permission(ActionEnum.updateGroupPermission)
  @Put(':id')
  async updateGroupPermission(
    @Param('id') id,
    @Body() updateData: UpdateGroupPermissionDto,
    @I18n() i18n: I18nContext,
  ): Promise<Response> {
    try {
      const result = await this.groupPermissionService.updateGroupPermission(
        id,
        updateData,
      );
      return {
        statusCode: HttpStatus.OK,
        message: await i18n.translate('common.UPDATE_ITEM_SUCCESSFULLY', {
          args: { property: 'group permission' },
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
          args: { property: 'group permission' },
        }),
        error: await i18n.translate('validation.UNPROCESSABLE_ENTITY'),
      };
    }
  }

  @Permission(ActionEnum.deleteGroupPermission)
  @ApiOperation({ summary: 'Delete GroupPermission by Id ' })
  @ApiParam({ required: true, name: 'id', example: '6094dc6f51d62f00365ed928' })
  @Delete(':id')
  async DeleteGroupPermissionByID(
    @Param('id') id: string,
    @I18n() i18n: I18nContext,
  ): Promise<Response> {
    try {
      const result = await this.groupPermissionService.deleteGroupPermission(
        id,
      );
      return {
        statusCode: HttpStatus.OK,
        message: await i18n.translate('common.DELETE_ITEM_SUCCESSFULLY', {
          args: { property: 'group permission' },
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
          args: { property: 'group permission' },
        }),
        error: await i18n.translate('validation.UNPROCESSABLE_ENTITY'),
      };
    }
  }
}
