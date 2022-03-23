const mongoose = require('mongoose');

mongoose.connectToDatabase = () => {
    console.info(`Connecting to database...`);

    const school_base = mongoose.createConnection(process.env.DB_CONNECTION_SCHOOL_BASE, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    });
    const school_users = mongoose.createConnection(process.env.DB_CONNECTION_SCHOOL_USERS, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    });
    const post_images = mongoose.createConnection(process.env.DB_CONNECTION_POST_IMAGES, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    });

    const connections = [school_base, school_users, post_images];
    connections.forEach(c => {
        c.once('connected', () => {
            console.info(`Connected to database: ${ c.name }`);
        });
        c.once('reconnected', () => {
            console.info(`Reconnected to database: ${ c.name }`);
        });
        c.on('disconnected', () => {
            console.warn(`Disconnected from database: ${ c.name }`);
        });
    });

    mongoose.schoolbase = school_base;
    mongoose.schoolusers = school_users;
    mongoose.schoolfiles = post_images;
}

module.exports = mongoose;
