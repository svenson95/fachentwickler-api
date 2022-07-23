import Posts from '../models/Posts';
import { Post } from '../types/post';

export async function changePostTypeValues() {
  const posts: Post[] = await Posts.find();

  posts.forEach(async (post) => {
    // const updatedElements = post.elements;
    // updatedElements.forEach((element, index) => {
    //   if (element.type === 'title') this[index].type = 'TITLE';
    //   if (element.type === 'subtitle') this[index].type = 'SUBTITLE';
    //   if (element.type === 'text') this[index].type = 'TEXT';
    //   if (element.type === 'image') this[index].type = 'IMAGE';
    //   if (element.type === 'line') this[index].type = 'LINE';
    //   if (element.type === 'list') this[index].type = 'LIST';
    //   if (element.type === 'table') this[index].type = 'TABLE';
    //   if (element.type === 'code') this[index].type = 'CODE';
    //   if (element.type === 'file') this[index].type = 'FILE';
    //   if (element.type === 'hint') this[index].type = 'HINT';
    //   if (element.type === 'answer-group') this[index].type = 'ANSWER_GROUP';
    //   if (element.type === 'table-group') this[index].type = 'TABLE_GROUP';
    //   if (element.type === 'youtube-video') this[index].type = 'YOUTUBE_VIDEO';
    // }, updatedElements);
    // console.log(post._id);
    // await Posts.updateOne(
    //   { _id: post._id },
    //   {
    //     $set: {
    //       elements: updatedElements,
    //     },
    //   }
    // );
  });

  console.log('finished');
}

export async function changePostImageURLs() {
  const posts: Post[] = await Posts.find();

  posts.forEach(async (post) => {
    // const updatedElements = post.elements;
    // updatedElements.forEach((element) => {
    //   if (element.type === 'IMAGE') {
    //     // eslint-disable-next-line no-param-reassign
    //     element.content = element.content.substring(
    //       element.content.lastIndexOf('/') + 1,
    //       element.content.length,
    //     );
    //   }
    // }, updatedElements);
    // await Posts.updateOne(
    //   { _id: post._id },
    //   {
    //     $set: {
    //       elements: updatedElements,
    //     },
    //   }
    // );
  });

  console.log('finished');
}

export async function changePostSchoolWeekProp() {
  const posts: Post[] = await Posts.find();

  posts.forEach(async (post) => {
    //   await Posts.updateOne(
    //     { _id: post._id },
    //     {
    //       $set: {
    //         schoolWeek: Number(post.schoolWeek),
    //       },
    //     }
    //   );
  });

  console.log('finished');
}
