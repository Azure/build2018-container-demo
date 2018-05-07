var util = require('util');
var async = require('async');
const mongoose = require('mongoose');

let URI = process.env.MONGODB_URI;
let PASS = process.env.MONGODB_PASS;
let USER = process.env.MONGODB_USER;

let Schema = mongoose.Schema,
    ObjectId = mongoose.Types.ObjectId;

let subjectSchema = new Schema({
    uid: Number,
    name: String,
    imgUrl: String,
    description: String,
    siteCode: String,
    metaData: mongoose.Schema.Types.Mixed
});

mongoose.model('Subject', subjectSchema, 'subjects');
let Subject = mongoose.model("Subject");

let ratingSchema = new Schema({
    siteCode: String,
    subjectRated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
    rating: { type: Number, min: 0, max: 5, default: 0 },
    metadata: mongoose.Schema.Types.Mixed,
    timestamp: { type: Date, default: Date.now }
});

mongoose.model('Rating', ratingSchema, 'ratings');
let Rating = mongoose.model("Rating");

mongoose.Promise = require("bluebird");

const reconnectTimeout = 10000; // ms.

function connect() {
    mongoose.connect(process.env.MONGODB_URI, {
        auth: {
            user: process.env.MONGODB_USER,
            password: process.env.MONGODB_PASS,
            dbName: 'webratings',
            ssl: true
        }
    })
        .then(() => console.log('connection successful'))
        .catch((err) => console.error(err));

}

// make sure your connected
// the writings on the wall

const db = mongoose.connection;

db.on("connecting", () => {
    console.info(`connecting to DB @ `, URI);
});

// db.on("error", error => {
//     console.error(`connection error: ${error}`);
//     mongoose.disconnect();
// });

db.on("connected", () => {
    console.info(`connected`);
});

db.once("open", () => {
    console.info(`connection opened!`);
});

db.on("reconnected", () => {
    console.info(`db reconnected!`);
});

db.on("disconnected", () => {
    console.error(
        `db disconnected! reconnecting in ${reconnectTimeout / 1000}s...`
    );
    setTimeout(() => connect(), reconnectTimeout);
});

connect();

function getOverview(dcb) {
    var subjects = {};

    async.waterfall(
        [
            function (cb) {
                Subject.find({ siteCode: 'PRG' }).then(results => {
                    for (i = 0; i < results.length; i++) {
                        subjects[results[i]._id] = results[i];
                        if (i === results.length - 1) {
                            cb(null, subjects);
                        }
                    }
                });
            },
            function (subjects, cb) {
                Rating.aggregate([
                    {
                        $group: {
                            _id: "$subjectRated",
                            stars: { $sum: "$rating" },
                            votes: { $sum: 1 }
                        }
                    },
                    { $sort: { stars: -1 } }
                ])
                    .then(ratings => {
                        cb(null, ratings, subjects);
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        ],
        function (err, results, subjects) {
            if (err) {
                dcb(err);
            }
            var output = {};
            var current = new Date();
            output.timeStamp = current.toLocaleDateString() + ' @ ' +current.toLocaleTimeString();
            
            for (i = 0; i < results.length; i++) {

                var currentId = results[i]._id.toString();
                var currentname = subjects[currentId].name;
                output[currentname] = {}

                output[currentname].average = results[i].stars / results[i].votes;
                output[currentname].total = results[i].stars;
                
                if (i === results.length - 1) {
                    dcb(output);
                }
            }
        }
    );

}

setInterval(function () {
    getOverview(function (data) {
        console.log(data);
    });
}, 2000);