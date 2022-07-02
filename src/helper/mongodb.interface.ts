import mongoose, { CallbackWithoutResult } from 'mongoose';
import { Connection } from 'mongoose';
import { error, info, warn } from './logging';

export class MongoDBInterface {
  private connectionString = `${process.env.DATABASE_PREFIX}//${process.env.DATABASE_HOST}/?${process.env.DATABASE_OPTIONS}`;

  private connection = mongoose.connection;

  public async connect() {
    info('Connecting to database ...');

    this.connection
      .once('connected', () => {
        info(`Connected to database '${this.connection.host}'`);
      })
      .once('reconnected', () => {
        info(`Reconnected to database '${this.connection.host}'`);
      })
      .on('disconnected', () => {
        warn(`Disconnected from database '${this.connection.host}'`);
      })
      .on('error', (err) => {
        warn(`Connection error: '${err}'`);
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
            error(err.message);
            reject();
          } else {
            resolve(null);
          }
        },
      );
    });
  }

  public async disconnect(): Promise<void> {
    return this.connection.close();
  }
}

const options = {
  // ensures connections to the same databases are cached
  useCache: true,
};

export const schoolbase: Connection = mongoose.connection.useDb('school-base', options);

export const schoolusers: Connection = mongoose.connection.useDb('school-users', options);

export const postimages: Connection = mongoose.connection.useDb('post-images', options);
