var express = require('express');
var router = express.Router();
var auth = require('../middleware/authentication');
var sqlite3 = require('../services/sqlite3');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/rateTalk', auth.ensureAisuthenticated, function(req, res, next){
    res.json({ 'ok': true});
});

router.get('/api/getVotes', auth.ensureAisuthenticated, function(req, res, next){
    sqlite3.getVotesByUserId(req.user.id, function(votes){
        res.json(votes);
    });
});


router.get('/talks', function(req, res, next){
    sqlite3.getPapers(function(papers){
        res.json(papers);
    });
});







module.exports = router;
