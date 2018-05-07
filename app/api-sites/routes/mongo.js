var express = require("express");
var async = require("async");
var router = express.Router();
var jsonResponse = require("../models/jsonResponse");
var mongoose = require("mongoose");
var Site = mongoose.model("Site");
var CurrentSite = mongoose.model("CurrentSite");

/* Default GET JSON for Mongo API */
router.get("/", function(req, res, next) {
  var response = new jsonResponse("Default /api endpoint for mongo sites", 200, []);
  res.json(response).status(response.status);
});

/* Get all sites */
/* GET /api/sites */
router.get("/sites", function(req, res, next) {
  Site.find({})
    .then(function(sites) {
      var response = new jsonResponse("ok", 200, sites);
      res.json(response).status(response.status);
    })
    .catch(next);
});

/* Get site by siteCode */
/* GET /api/sites/JLA */
router.get("/sites/:sitecode", function(req, res, next) {
    Site.findOne({ siteCode: req.params.sitecode })
      .then(function(site) {
        var response = new jsonResponse("ok", 200, site);
        res.json(response).status(response.status);
      })
      .catch(next);
  });

/* Get current live sitecode */
/* GET /api/currentsite */
router.get("/currentsite", function(req, res, next) {
  CurrentSite.findOne({})
    .then(function(site) {
      var data = { current: site.currentLiveSiteCode };
      var response = new jsonResponse("ok", 200, data);
      res.json(response).status(response.status);
    })
    .catch(next);
});

module.exports = router;
