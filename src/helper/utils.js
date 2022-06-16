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

  sendResponse(response, statusCode, success, message, data, error) {
    response.status(statusCode).json({
      success: success,
      message: message,
      data: data,
      error: error,
    });
  },

  okResponse(message, data, res) {
    return this.sendResponse(res, 200, true, message, data, null);
  },

  createdResponse(message, data, res) {
    return this.sendResponse(res, 201, true, message, data, null);
  },

  unauthorizedResponse(message, res) {
    return this.sendResponse(res, 401, false, message, null, null);
  },

  notFoundResponse(message, res) {
    return this.sendResponse(res, 404, false, message, null, null);
  },

  conflictResponse(message, res) {
    return this.sendResponse(res, 409, false, message, null, null);
  },

  internalErrorResponse(message, error, res) {
    return this.sendResponse(res, 500, false, message, null, error);
  },
};
