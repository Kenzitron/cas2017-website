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

router.get('/api/paper/:paperId/votes', auth.ensureAisuthenticated, function(req, res, next){
    sqlite3.getVotesByUserId(req.user.id, function(votes){
        res.json(votes);
    });
});

router.post('/api/paper/:paperId/vote',  auth.ensureAisuthenticated, function(req, res, next){
    var userId = req.user.id;
    var userId = 2;
    var score = req.body.score;
    var paperId = req.params.paperId;
    sqlite3.getVotesByUserAndPaper(userId, paperId).then((votes) => {
        if(votes.length === 0){
            sqlite3.insertVote(userId, paperId, score);
        }else{
            sqlite3.updateVote(userId, paperId, score);
        }
        res.json({ userId : userId, paperId : paperId, score : score });
    })    
});


router.get('/talks', function(req, res, next){
    sqlite3.getPapers(function(papers){
        res.json(papers);
    });
});







module.exports = router;
