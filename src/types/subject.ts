import { PostArticle, PostElement } from './post';
import { TopicPopulated } from './topic';

interface Subject {
  subject: string;
  description: Array<PostElement>;
}

export interface SubjectPopulated extends Subject {
  topics: TopicPopulated[];
  tests?: PostArticle[];
}

export interface SubjectUnpopulated extends Subject {
  topics: string[];
  tests?: string[];
}
