import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { Permission1Service } from './premission1.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from 'common/guard/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'utils/response';
import { CreatePermissionDto } from './dto/createPermission.dto';
import { UpdatePermissionDto } from './dto/updatePermission.dto';
@ApiTags('permission')
@Controller('premission')
export class Premission1Controller {
  constructor(private readonly premission1Service: Permission1Service) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async getPermissions(): Promise<Response> {
    try {
      const permissions: any = await this.premission1Service.getAllPermission();
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
      const permission = await this.premission1Service.getPermissionBydID(id);
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
      const result = await this.premission1Service.createPermission(per);
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
      const result = await this.premission1Service.updatePermission(id, per);
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
      const result = await this.premission1Service.deletePermissionById(id);
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
