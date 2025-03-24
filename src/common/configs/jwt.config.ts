import { IJwt } from '@common/models-interfaces';
import { registerAs } from '@nestjs/config';

export default registerAs(
  'JWT_CONFIG',
  (): IJwt => ({
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  }),
);
