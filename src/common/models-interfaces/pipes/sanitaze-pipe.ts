import { normalizeEmail } from 'validator';
import { isArray, isObject, isString } from 'lodash';
import { Injectable, PipeTransform } from '@nestjs/common';

import { SANITIZE_EXCEPT, NORMALIZE_EMAIL } from '@common/constants';

@Injectable()
export class SanitizePipe implements PipeTransform {
  private _sanitizeString(value: string, key: string = null): string {
    if (!SANITIZE_EXCEPT.includes(key)) {
      if (NORMALIZE_EMAIL.includes(key)) {
        const normalizedEmail = normalizeEmail(value);
        value = normalizedEmail ? normalizedEmail : value;
      }
      value = value?.trim();
    }
    return value;
  }

  private _sanitize(values: object | unknown[]): object | unknown[] {
    if (isObject(values) && !Array.isArray(values)) {
      Object.keys(values).forEach((key) => {
        if (isObject(values[key])) {
          values[key] = this._sanitize(values[key]);
        } else {
          if (isString(values[key])) {
            values[key] = this._sanitizeString(values[key], key);
          }
        }
      });
    }
    if (isArray(values)) {
      values.forEach((value) => {
        if (isObject(value)) {
          value = this._sanitize(value);
        } else {
          if (isString(value)) {
            value = this._sanitizeString(value);
          }
        }
      });
    }

    return values;
  }

  transform(values: object) {
    if (isObject(values)) {
      return this._sanitize(values);
    }
    return values;
  }
}
