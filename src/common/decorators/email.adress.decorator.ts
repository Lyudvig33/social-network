import {
  isEmail,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

export function IsEmail(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsEmail',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string) {
          return isEmail(value)
        },
      },
    });
  };
}
