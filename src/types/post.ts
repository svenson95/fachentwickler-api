export enum PostElementType {
  TITLE = 'TITLE',
  SUBTITLE = 'SUBTITLE',
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  LINE = 'LINE',
  LIST = 'LIST',
  TABLE = 'TABLE',
  CODE = 'CODE',
  FILE = 'FILE',
  HINT = 'HINT',
  ANSWER_GROUP = 'ANSWER_GROUP',
  TABLE_GROUP = 'TABLE_GROUP',
}

export enum PostType {
  ARTICLE = 'article',
  TASKS = 'tasks',
  QUIZ = 'quiz',
  INDEX_CARDS = 'index-cards',
  MATCHING = 'matching',
  TEST = 'test',
}

export interface SublistItem {
  content?: string;
  sublist: string[];
}

interface TableColumn {
  align: 'left' | 'middle' | 'right';
  content: string;
  colSpan?: number;
  rowSpan?: number;
}

interface TableRow {
  type: 'header' | 'default';
  columns: TableColumn[];
}

export interface PostElement {
  type: PostElementType | string;
  content?: string;
  hidden?: boolean;
  language?: 'java' | 'php' | 'javascript' | 'sql';
  list?: Array<SublistItem | string>;
  ordered?: boolean;
  rows?: TableRow[];
  object?: object;
  size?: string;
  elements?: PostElement[];
}

interface IndexCardQuestion {
  question: string;
  answer: string;
}

export interface MatchingPair {
  leftpart: string;
  rightpart: string;
  pairNumber: number;
}

interface QuizQuestion {
  question: string;
  answer: number;
  choice1: string;
  choice2: string;
}

export interface Post {
  _id?: string;
  topicId?: string;
  url: string;
  title: string;
  description: string;
  subject: string;
  type: PostType | string;
  lessonDate: string;
  lastUpdate: string;
  schoolWeek: number;
}

export interface PostArticle extends Post {
  elements: PostElement[];
}

export interface PostQuiz extends Post {
  elements: QuizQuestion[];
}

export interface PostIndexCards extends Post {
  elements: IndexCardQuestion[];
}

export interface PostMatching extends Post {
  elements: MatchingPair[][];
}

export type PostTypes = PostArticle | PostQuiz | PostMatching | PostIndexCards;
