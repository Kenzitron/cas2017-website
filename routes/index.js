const express = require('express');
const router = express.Router();
const auth = require('../middleware/authentication');
const sqlite3 = require('../services/sqlite3');
const votesService = require('../services/votesService');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {title: 'Express'});
});


router.get('/api/rateTalk', auth.ensureIsAuthenticated, function(req, res, next) {
    res.json({'ok': true});
});


router.get('/api/votes', auth.ensureIsAuthenticated, function(req, res, next){
    sqlite3.getVotesByUserId(req.user.id).then(votes => res.json(votes));
});

router.get('/api/paper/:paperId/votes', auth.ensureIsAuthenticated, function(req, res, next){
    sqlite3.getVotesByUserId(req.user.id, function(votes){
        res.json(votes);
    });
});

router.post('/api/paper/:paperId/vote', auth.ensureIsAuthenticated, function(req, res, next){
    let userId = Number.parseInt(req.user.id);
    let score = Number.parseInt(req.body.score);
    let paperId = Number.parseInt(req.params.paperId);    
    sqlite3.getVotesByUserId(userId).then((userVotes) => {  
        let paperVoteIndex = userVotes.findIndex(vote => { return vote.paper_id === paperId});
        if(paperVoteIndex >= 0){
            userVotes[paperVoteIndex].score = score;
        }
        let sumVotes = votesService.getScoreTotal(userVotes);
        if (sumVotes > 10){
            res.status(409).send("Votes can not exceed 10 points");
        }
        if(paperVoteIndex < 0){
            sqlite3.insertVote(userId, paperId, score);
        }else{
            sqlite3.updateVote(userId, paperId, score);
        }
        res.json({ userId : userId, paperId : paperId, score : score });
    })    
});

router.get('/talks', function(req, res, next) {
    sqlite3.getPapers(function(papers) {
        res.json(papers);
    });

});


module.exports = router;
