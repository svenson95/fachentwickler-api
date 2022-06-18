/* eslint-disable no-unused-vars */
const Posts = require('../models/posts/Posts');

async function changePostTypeValues() {
  const posts = await Posts.find();

  posts.forEach(async (post) => {
    const updatedElements = post.elements;

    updatedElements.forEach((element, index) => {
      if (element.type === 'title') this[index].type = 'TITLE';
      if (element.type === 'subtitle') this[index].type = 'SUBTITLE';
      if (element.type === 'text') this[index].type = 'TEXT';
      if (element.type === 'image') this[index].type = 'IMAGE';
      if (element.type === 'line') this[index].type = 'LINE';
      if (element.type === 'list') this[index].type = 'LIST';
      if (element.type === 'table') this[index].type = 'TABLE';
      if (element.type === 'code') this[index].type = 'CODE';
      if (element.type === 'file') this[index].type = 'FILE';
      if (element.type === 'hint') this[index].type = 'HINT';
      if (element.type === 'answer-group') this[index].type = 'ANSWER_GROUP';
      if (element.type === 'table-group') this[index].type = 'TABLE_GROUP';
    }, updatedElements);

    console.log(post._id);

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

async function changePostImageURLs() {
  const posts = await Posts.find();

  posts.forEach(async (post) => {
    const updatedElements = post.elements;

    updatedElements.forEach((element) => {
      if (element.type === 'IMAGE') {
        // eslint-disable-next-line no-param-reassign
        element.content = element.content.substring(
          element.content.lastIndexOf('/') + 1,
          element.content.length,
        );
      }
    }, updatedElements);

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

async function changePostSchoolWeekProp() {
  const posts = await Posts.find();

  posts.forEach(async (post) => {
    // await Posts.updateOne(
    //   { _id: post._id },
    //   {
    //     $set: {
    //       schoolWeek: Number(post.schoolWeek),
    //     },
    //   }
    // );
  });

  console.log('finished');
}

module.exports = {
  changePostTypeValues,
  changePostImageURLs,
  changePostSchoolWeekProp,
};
