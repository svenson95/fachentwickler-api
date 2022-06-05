const Subjects = require('../models/subject/Subject');

async function changeSubjectDescription(prop) {
  const subjects = await Subjects.find();

  subjects.forEach(async (subject) => {
    const updatedElements = subject.description;

    updatedElements.forEach(function (element, index) {
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

    console.log(subject);

    // await Subjects.updateOne(
    //   { _id: subject._id },
    //   {
    //     $set: {
    //       description: updatedElements,
    //     },
    //   }
    // );
  });

  console.log('finished');
}
