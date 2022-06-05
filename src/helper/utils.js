const Posts = require('../models/posts/Posts');

module.exports = {
  async allArticles() {
    return await Posts.find({}, { elements: 0 });
  },

  currentDate() {
    const today = new Date();
    let yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // 0-11
    let dd = today.getDate();

    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }
    return yyyy + '-' + mm + '-' + dd;
  },
};
