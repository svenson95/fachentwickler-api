const mongoose = require('mongoose');
const { error, info, warn } = require('./logging');

class MongoDBInterface {
  connectionString = `${process.env.DATABASE_PREFIX}//${process.env.DATABASE_HOST}/?${process.env.DATABASE_OPTIONS}`;

  connection = mongoose.connection;

  async connect() {
    info('Connecting to database ...');

    this.connection
      .once('connected', () => {
        info(`Connected to database '${this.connection.host}'.`);

        const options = {
          // ensures connections to the same databases are cached
          useCache: true,
        };

        mongoose.schoolbase = this.connection.useDb('school-base', options);
        mongoose.schoolusers = this.connection.useDb('school-users', options);
        mongoose.postimages = this.connection.useDb('post-images', options);
      })
      .once('reconnected', () => {
        info(`Reconnected to database '${this.connection.host}'.`);
      })
      .on('disconnected', () => {
        warn(`Disconnected from database '${this.connection.host}'.`);
      });

    return new Promise((resolve, reject) => {
      mongoose.connect(
        this.connectionString,
        {
          // While nice for development, it is recommended this behavior be disabled in
          // production since index creation can cause a significant performance impact.
          autoIndex: false,
          user: process.env.DATABASE_USER,
          pass: process.env.DATABASE_PASSWORD,
        },
        (err) => {
          if (err) {
            error(err);
            reject();
          } else {
            resolve();
          }
        },
      );
    });
  }

  async disconnect() {
    return this.connection.close();
  }
}

module.exports = {
  MongoDBInterface,
};
