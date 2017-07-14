const express = require('express');
const async = require('async');
const router = express.Router();
const auth = require('../middleware/authentication');
const sqlite3 = require('../services/sqlite3');
const votesService = require('../services/votesService');
const paperService = require('../services/paperService');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {title: 'Express'});
});


router.get('/talks', (req, res, next) => {
    let user = req.user;
    Promise.all([
        paperService.getPapersVotedByUser(user), votesService.getRemainingVotes(user)
    ]).then(values => {
        res.render('papers', {'papers': values[0], 'remaining_votes': values[1]});
    });
});


router.get('/api/votes', auth.ensureIsAuthenticated, function(req, res, next){
    sqlite3.getVotesByUserId(req.user.id).then(votes => res.json(votes));
});

router.post('/api/paper/:paperId/vote', auth.ensureIsAuthenticated, function(req, res, next){
    let user = Number.parseInt(req.user);
    let score = Number.parseInt(req.body.score);
    let paperId = Number.parseInt(req.params.paperId);    
    sqlite3.getVotesByUserId(user.id).then((userVotes) => {
        let paperVoteIndex = userVotes.findIndex(vote => { return vote.paper_id === paperId});
        if(paperVoteIndex >= 0){
            userVotes[paperVoteIndex].score = score;
        }else{
            userVotes.push({
                user_id: user.id,
                paper_id: paperId,
                score: score
            })
        }
        let sumVotes = votesService.getScoreTotal(userVotes);
        if (sumVotes > user.num_votes){
            res.status(409).send("Votes can not exceed 10 points");
        }
        if(paperVoteIndex < 0){
            sqlite3.insertVote(user.id, paperId, score);
        }else{
            sqlite3.updateVote(user.id, paperId, score);
        }
        res.json({ userId : userId, paperId : paperId, score : score });
    })    
});

router.get('/api/talks', auth.ensureIsAuthenticated, function(req, res, next) {
    sqlite3.getPapers().then((papers) => {
        res.json(papers);
    });
});

module.exports = router;
