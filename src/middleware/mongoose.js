const mongoose = require('mongoose');

mongoose.connectToDatabase = () => {
  return new Promise((resolve, reject) => {
    console.info(`Connecting to database...`);

    const connection = mongoose.createConnection(process.env.DB_CONNECTION);

    connection
      .once('connected', () => {
        console.info(`Connected to database: ${connection.host}`);

        const options = {
          //ensures connections to the same databases are cached
          useCache: true,
          //remove event listeners from the main connection
          noListener: true,
        };

        mongoose.schoolbase = connection.useDb('school-base');
        mongoose.schoolusers = connection.useDb('school-users');
        mongoose.postimages = connection.useDb('post-images');

        resolve();
      })
      .once('reconnected', () => {
        console.info(`Reconnected to database: ${connection.host}`);
      })
      .on('disconnected', () => {
        console.warn(`Disconnected from database: ${connection.host}`);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

module.exports = mongoose;
