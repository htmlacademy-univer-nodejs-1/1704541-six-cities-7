import type { User } from './user.type.js';

export interface Comment {
  text: string;
  publicationDate: Date;
  rating: number;
  author: User;
}
