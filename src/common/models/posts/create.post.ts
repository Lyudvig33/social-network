import { MediaType } from '@common/database/entities'; 

export class ICreatePost {
  content: string;
  url?: string;
  mediaType: MediaType;
}
