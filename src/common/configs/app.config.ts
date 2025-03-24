import { IApp } from '@common/models-interfaces';
import { registerAs } from '@nestjs/config';

export default registerAs(
  'APP_CONFIG',
  (): IApp => ({
    nodeEnv: process.env.NODE_ENV,
    environment: process.env.ENVIRONMENT,
  }),
);
