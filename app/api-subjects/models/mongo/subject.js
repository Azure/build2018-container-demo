
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var subjectSchema = new Schema({
    uid: Number,
    name: String,
    imgUrl: String,
    description: String,
    siteCode: String,
    metaData: mongoose.Schema.Types.Mixed
});

mongoose.model('Subject', subjectSchema, 'subjects');