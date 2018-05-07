
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var currentSiteSchema = new Schema({
    currentLiveSiteCode: String
});

mongoose.model('CurrentSite', currentSiteSchema, 'currentsite');