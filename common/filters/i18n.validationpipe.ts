import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  UnprocessableEntityException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { I18nRequestScopeService } from 'nestjs-i18n';

@Injectable()
export class I18nValidationPipe implements PipeTransform<any> {
  constructor(private readonly i18n: I18nRequestScopeService) {}
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors?.length > 0) {
      throw new UnprocessableEntityException(
        await this.translateErrors(errors),
        await this.i18n.translate('validation.UNPROCESSABLE_ENTITY'),
      );
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  async translateErrors(errors: ValidationError[]) {
    const data = [];
    let message: any;

    for (let i = 0; i < errors.length; i++) {
      const error = errors[i];
      if (!!error.constraints) {
        message = await Promise.all(
          Object.keys(error.constraints).map(async (key: any) => {
            return await this.i18n.translate(`validation.${key}`, {
              args: {
                field: error.property,
                property: Object.values(error.constraints)[0] ?? '',
              },
            });
          }),
        );
        data.push({ field: error.property, message });
      } else {
        const property = error.property;
        for (let j = 0; j < error.children.length; j++) {
          const errorChildren = error.children[j];
          if (errorChildren.children) {
            for (let k = 0; k < errorChildren.children.length; k++) {
              const error = errorChildren.children[k];
              if (!!error.constraints) {
                message = await Promise.all(
                  Object.keys(error.constraints).map(async (key: any) => {
                    return await this.i18n.translate(`validation.${key}`, {
                      args: {
                        field: error.property,
                        property: Object.values(error.constraints)[0] ?? '',
                      },
                    });
                  }),
                );
                data.push({
                  field: `${property}.${j}.${error.property}`,
                  message,
                });
              } else {
                for (let l = 0; l < error.children.length; l++) {
                  if (error.children[l]) {
                    for (
                      let m = 0;
                      m < error.children[l].children.length;
                      m++
                    ) {
                      const subchildrenErr = error.children[l].children[m];
                      if (subchildrenErr) {
                        message = await Promise.all(
                          Object.keys(subchildrenErr.constraints).map(
                            async (key: any) => {
                              return await this.i18n.translate(
                                `validation.${key}`,
                                {
                                  args: {
                                    field: subchildrenErr.property,
                                    property:
                                      Object.values(
                                        subchildrenErr.constraints,
                                      )[0] ?? '',
                                  },
                                },
                              );
                            },
                          ),
                        );
                        data.push({
                          field: `${property}.${j}.${error.property}.${m}.${subchildrenErr.property}`,
                          message,
                        });
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return data;
  }

  async translateErrors___(errors: ValidationError[]) {
    const data = [];
    const data3 = [];

    const data2 = [];
    let message: any;

    for (let i = 0; i < errors.length; i++) {
      const error = errors[i];
      if (!!error.constraints) {
        message = await Promise.all(
          Object.keys(error.constraints).map(async (key: any) => {
            return await this.i18n.translate(`validation.${key}`, {
              args: {
                field: error.property,
                property: Object.values(error.constraints)[0] ?? '',
              },
            });
          }),
        );
        data.push({ field: error.property, message });
      } else {
        const property = error.property;
        for (let j = 0; j < error.children.length; j++) {
          const errorChildren = error.children[j];
          if (errorChildren.children) {
            for (let k = 0; k < errorChildren.children.length; k++) {
              const error = errorChildren.children[k];
              if (!!error.constraints) {
                message = await Promise.all(
                  Object.keys(error.constraints).map(async (key: any) => {
                    return await this.i18n.translate(`validation.${key}`, {
                      args: {
                        field: error.property,
                        property: Object.values(error.constraints)[0] ?? '',
                      },
                    });
                  }),
                );
                data2.push({
                  object: j,
                  message: { field: error.property, message },
                });
              }
            }
          }
        }

        var output = [];
        data2.forEach((item) => {
          var existing = output.filter((v, i) => {
            return v.object == item.object;
          });
          if (existing.length) {
            var existingIndex = output.indexOf(existing[0]);
            output[existingIndex].message = output[
              existingIndex
            ].message.concat(item.message);
          } else {
            if (typeof item.message == 'object') item.message = [item.message];
            output.push(item);
          }
        });

        data3.push({
          field: property,
          message: output,
        });
      }
    }
    return [...data, ...data3];
  }

  async translateErrors__(errors: ValidationError[]) {
    const data = [];
    for (let i = 0; i < errors.length; i++) {
      const message = await Promise.all(
        Object.keys(errors[i].constraints).map(async (key: any) => {
          return await this.i18n.translate(`validation.${key}`, {
            args: {
              field: errors[i].property,
              property: Object.values(errors[i].constraints)[0] ?? '',
            },
          });
        }),
      );
      data.push({ field: errors[i].property, message });
    }
    return data;
  }

  async translateErrors_(errors: ValidationError[]) {
    const data = [];
    errors.forEach(async (error) => {
      const message = await Promise.all(
        Object.values(error.constraints).map(async (value: string) =>
          this.i18n.translate(`validation.${value}`, {
            args: {
              property: error.property,
            },
          }),
        ),
      );
      data.push({ field: error.property, message });
    });
    return data;
  }
}
