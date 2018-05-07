var express = require("express");
var async = require("async");
var router = express.Router();
var jsonResponse = require("../models/jsonResponse");
var mongoose = require("mongoose");
var Rating = mongoose.model("Rating");
var Subject = mongoose.model("Subject");


/* Default GET JSON for Mongo API */
router.get("/", function(req, res, next) {
  var response = new jsonResponse("Default /api endpoint for mongo Rating", 200, []);
  res.json(response).status(response.status);
});


/* Get all ratings */
/* GET /api/ratings */
router.get("/ratings", function(req, res, next) {
  Rating.find({})
    .then(function(ratings) {
      var response = new jsonResponse("ok", 200, ratings);
      res.json(response).status(response.status);
    })
    .catch(next);
});

/* Get ratings by siteCode */
/* GET /api/ratings/JLA */

/* GET rated heroes */
router.get("/ratings/:sitecode", function(req, res, next) {
  var subjects = {};
  async.waterfall(
    [
      function(cb) {
        Subject.find({siteCode:req.params.sitecode}).then(results => {
          //console.log(results);
          for (i = 0; i < results.length; i++) {
            subjects[results[i]._id] =  results[i];
            if (i === results.length - 1) {
              // console.log(subjects);
              cb(null, subjects);
            }
          }
        });
      },
      function(subjects, cb) {
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
          .catch(err =>{
            console.log(err);
          })
      }
    ],
    function(err, ratings, subjects) {
      if(err){
        var response = new jsonResponse("ERROR", 500, err);
        res.json(response).status(response.status);
      }
      var output = [];
      //console.log(ratings);
      for (i = 0; i < ratings.length; i++) {
        
        var result = {};
        var currentId = ratings[i]._id.toString();
        result.name = subjects[currentId].name;
        result.imgUrl = subjects[currentId].imgUrl;
        result.stars = ratings[i].stars;
        result.votes = ratings[i].votes;
        result.average = ratings[i].stars / ratings[i].votes;
        result.halfstar = Math.round((ratings[i].stars / ratings[i].votes)*2)/2;
        output.push(result);

        if (i === ratings.length - 1) {
          output.sort(function (a, b) {
            return b.average > a.average
          });
          //output.sort();
          
          var response = new jsonResponse("ok", 200, output);
          res.json(response).status(response.status);
        }
      }
    }
  );
});


/* POST single subject */
/* POST /api/subject */
router.post("/rating", function(req, res, next) {
    
    var input = req.body;
    
    var rating = new Rating({
        siteCode: input.siteCode,
        subjectRated: input.subjectRated,
        rating: input.rating,
        metadata: input.metadata
    });

    rating.save().then(function(doc) {
        var response = new jsonResponse("ok", 200, doc);
        res.json(response).status(response.status);
    });

  });

  router.post("/ratings/:sitecode", function(req, res, next) {
    var input = req.body;
    var ratings = [];
    var ip = input.userIp;
    for (var i = 0, len = input.ratings.length; i < len; i++) {
      var rate = new Rating({
        rating: input.ratings[i].rating,
        metadata: {raterIp:ip},
        siteCode: req.params.sitecode,
        subjectRated: input.ratings[i].id
      });
      rate.save().then(function(rate) {
        ratings.push(rate);
      });
    }
    var response = new jsonResponse("ok", 200, ratings);
    res.json(response).status(response.status);
  });

module.exports = router;
