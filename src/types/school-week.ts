import { Post } from './post';

export interface SchoolWeek {
  _id?: string;
  schoolWeek: number;
  posts: Post[];
}

export interface WeekDays {
  day: number;
  lessons: Post[];
}
