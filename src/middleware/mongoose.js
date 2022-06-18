const mongoose = require('mongoose');

function connectToDatabase() {
  return new Promise((resolve, reject) => {
    console.info('Connecting to database...');

    const connection = mongoose.createConnection(process.env.DB_CONNECTION_STRING, {
      user: process.env.DB_USER,
      pass: process.env.DB_PASSWORD,
      // authSource: STACK_NAME,
    });

    connection
      .once('connected', () => {
        console.info(`Connected to database: ${connection.host}`);

        const options = {
          // ensures connections to the same databases are cached
          useCache: true,
          // remove event listeners from the main connection
          noListener: true,
        };

        mongoose.schoolbase = connection.useDb('school-base', options);
        mongoose.schoolusers = connection.useDb('school-users', options);
        mongoose.postimages = connection.useDb('post-images', options);

        resolve();
      })
      .once('reconnected', () => {
        console.info(`Reconnected to database: ${connection.host}`);
      })
      .on('disconnected', () => {
        console.warn(`Disconnected from database: ${connection.host}`);
      })
      .on('error', (err) => {
        console.error(err);
        reject(err);
      });
  });
}

mongoose.connectToDatabase = connectToDatabase;

module.exports = mongoose;
