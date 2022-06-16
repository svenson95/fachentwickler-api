const Posts = require('../models/posts/Posts');

function sendResponse(response, statusCode, success, message, data, error) {
  response.status(statusCode).json({
    success: success,
    message: message,
    data: data,
    error: error,
  });
}

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

  okResponse(message, data, res) {
    sendResponse(res, 200, true, message, data, null);
  },

  createdResponse(message, data, res) {
    sendResponse(res, 201, true, message, data, null);
  },

  unauthorizedResponse(message, res) {
    sendResponse(res, 401, false, message, null, null);
  },

  notFoundResponse(message, res) {
    sendResponse(res, 404, false, message, null, null);
  },

  conflictResponse(message, res) {
    sendResponse(res, 409, false, message, null, null);
  },

  internalErrorResponse(message, error, res) {
    sendResponse(res, 500, false, message, null, error);
  },
};
