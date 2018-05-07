
var mongoose = require('mongoose');
var Subject = mongoose.model('Subject');

var Schema = mongoose.Schema;

var ratingSchema = new Schema({
    siteCode: String,
    subjectRated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
    rating: { type: Number, min: 0, max: 5, default: 0 },
    metadata: mongoose.Schema.Types.Mixed,
    timestamp: { type: Date, default: Date.now }
});

mongoose.model('Rating', ratingSchema, 'ratings');