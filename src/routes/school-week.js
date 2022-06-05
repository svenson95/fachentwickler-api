const express = require('express');
const router = express.Router();

const { allArticles } = require('../helper/utils.js');

// Get specific school week by number
router.get('/number/:number', async (req, res) => {
  try {
    const objects = await allArticles();
    let week = { schoolWeek: Number(req.params.number), posts: [] };

    objects.forEach((post) => {
      if (req.params.number == post.schoolWeek) {
        week.posts.push(post);
      }
    });

    week.posts.sort(function (a, b) {
      if (a.lessonDate > b.lessonDate) {
        return 1;
      }
      if (a.lessonDate < b.lessonDate) {
        return -1;
      }
      return 0;
    });

    res.status(200).json(week);
  } catch (error) {
    res.status(500).json({
      message: 'Get school-week failed. Try again',
      error: error,
    });
  }
});

// Get all school weeks (history)
router.get('/all', async (req, res) => {
  try {
    const objects = await allArticles();
    const weeksArray = [];
    objects.forEach((post) => {
      if (post.schoolWeek > 0) {
        const weekObj = weeksArray.find((week) => week.schoolWeek === Number(post.schoolWeek));

        if (weekObj) {
          weekObj.posts.push(post);
        } else {
          weeksArray.push({
            schoolWeek: Number(post.schoolWeek),
            posts: [post],
          });
        }
      }
    });
    weeksArray.sort(function (a, b) {
      if (Number(a.schoolWeek) > Number(b.schoolWeek)) {
        return 1;
      }
      if (Number(a.schoolWeek) < Number(b.schoolWeek)) {
        return -1;
      }
      return 0;
    });
    weeksArray.forEach((week) => {
      week.posts.sort(function (a, b) {
        if (a.lessonDate > b.lessonDate) {
          return 1;
        }
        if (a.lessonDate < b.lessonDate) {
          return -1;
        }
        return 0;
      });
    });
    res.status(200).json(weeksArray);
  } catch (error) {
    res.status(500).json({
      message: 'Get all school-weeks (history) failed. Try again',
      error: error,
    });
  }
});

module.exports = router;
