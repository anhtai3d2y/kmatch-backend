import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class MessageErrorService {
  async messageErrorController(e: any) {
    if (e.stringValue && e.kind) {
      return {
        statusCode: e.code,
        message: `value: "${e.value}" is not an ${e.kind}`,
        error: 'A system error has occurred!',
      };
    }
    if (e.code === 11000) {
      throw new HttpException(
        {
          statusCode: e.code,
          message: `This item is already existed!`,
        },
        HttpStatus.FORBIDDEN,
      );
    }
    const message = e?.response?.message;
    let messageError: any = message;
    if (e.response) {
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

  async messageNotFoundService(property: any) {
    throw new HttpException(
      {
        error: 'ID_NOT_FOUND',
        message: `${property} ID not found!`,
        statusCode: HttpStatus.NOT_FOUND,
      },
      400,
    );
  }

  async messageNotValidService(property: any) {
    throw new HttpException(
      {
        statusCode: HttpStatus.FORBIDDEN,
        message: `${property} ID not valid!`,
      },
      HttpStatus.FORBIDDEN,
    );
  }

  async messagePasswordWrongFoundService() {
    throw new HttpException(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Wrong Password. Please try again!',
        error: 'WRONG_PASSWORD',
      },
      400,
    );
  }

  async messageLockedAccount() {
    throw new HttpException(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Account has been locked',
        error: 'LOCKER_ACCOUNT',
      },
      400,
    );
  }

  async messageEmailNotFoundService() {
    throw new HttpException(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Login email not found. Please register!',
        error: 'WRONG_EMAIL',
      },
      400,
    );
  }

  async messagePassNotConflictFoundService() {
    throw new HttpException(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Confirm password does not match!',
        error: 'NOT_CONFIRM_PASSWORD',
      },
      400,
    );
  }

  async messageVerificationCodeFoundService() {
    throw new HttpException(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Verification code is incorrect or has expired!',
        error: 'VERIFICATION_CODE_FOUND_OR_TIMEOUT',
      },
      400,
    );
  }

  async messageConflictService(property) {
    throw new HttpException(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: `This ${property} already exist`,
        error: 'CONFLICT',
      },
      11000,
    );
  }
}
