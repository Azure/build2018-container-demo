var express = require("express");
var async = require("async");
var router = express.Router();
var jsonResponse = require("../models/jsonResponse");
var mongoose = require("mongoose");
var Subject = mongoose.model("Subject");


/* Default GET JSON for Mongo API */
router.get("/", function(req, res, next) {
  var response = new jsonResponse("Default /api endpoint for mongo Subject", 200, []);
  res.json(response).status(response.status);
});


/* Get all subjects */
/* GET /api/subjects */
router.get("/subjects", function(req, res, next) {
  Subject.find({})
    .then(function(subjects) {
      var response = new jsonResponse("ok", 200, subjects);
      res.json(response).status(response.status);
    })
    .catch(next);
});

/* Get subjects by siteCode */
/* GET /api/subjects/JLA */
router.get("/subjects/:sitecode", function(req, res, next) {
    Subject.find({ siteCode: req.params.sitecode })
      .then(function(docs) {
        var response = new jsonResponse("ok", 200, docs);
        res.json(response).status(response.status);
      })
      .catch(next);
  });

/* POST single subject */
/* POST /api/subject */
router.post("/subject", function(req, res, next) {
    
    var input = req.body;
    
    var subject = new Subject({
        uid: input.uid,
        name: input.name,
        imgUrl: input.imgUrl,
        description: input.description,
        siteCode: input.siteCode
    });

    subject.save().then(function(doc) {
        var response = new jsonResponse("ok", 200, doc);
        res.json(response).status(response.status);
    });

  });



module.exports = router;
