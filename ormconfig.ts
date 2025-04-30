import * as path from 'path';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import {
  initializeTransactionalContext,
  addTransactionalDataSource,
} from 'typeorm-transactional';

const envModelProduction = process.env.NODE_ENV === 'production';

const envfile = path.resolve(
  __dirname,
  envModelProduction ? '.env.production' : '.env.development',
);

dotenv.config({
  path: envfile,
});


export const datasource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +(process.env.DATABASE_PORT || 5432),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['src/common/database/entities/*.entity.{ts,js}'],
  synchronize: true,
});

initializeTransactionalContext()
addTransactionalDataSource(datasource)