import { MediaType } from '@common/enums';

export class ICreatePost {
  content?: string;
  images?: string[];
  video?: string;
  mediaType?: MediaType;
}
