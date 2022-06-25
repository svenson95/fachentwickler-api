import { Post } from './post';

interface Topic {
  _id: string;
  title: string;
  url: string;
  subject: string;
}

export interface TopicPopulated extends Topic {
  links: Post[];
}

export interface TopicUnpopulated extends Topic {
  links: string[];
}
