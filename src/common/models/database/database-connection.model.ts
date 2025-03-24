export interface IDatabaseConnection {
  host: string;
  port: string | number;
  username: string;
  password: string;
  database: string;
  sync?: boolean;
}
