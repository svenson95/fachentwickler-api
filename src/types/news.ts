import { PostElement } from './post';

export interface SchoolNews {
  title: string;
  date: string;
  url: string;
  content: PostElement[];
}
