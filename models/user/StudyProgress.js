const mongoose = require('mongoose');

const studyProgSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

const connection = mongoose.createConnection(process.env.DB_CONNECTION_SCHOOLUSERS, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const StudyProg = connection.model('studyProgs', studyProgSchema, 'studyProgs');

module.exports = StudyProg;
