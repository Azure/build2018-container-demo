
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var siteSchema = new Schema({
    name: String,
    siteCode: String,
    pages: mongoose.Schema.Types.Mixed
});

mongoose.model('Site', siteSchema, 'sites');