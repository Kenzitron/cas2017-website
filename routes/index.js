const express = require('express');
const router = express.Router();
const auth = require('../middleware/authentication');
const sqlite3 = require('../services/sqlite3');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/api/rateTalk', auth.ensureIsAuthenticated, function(req, res, next) {
    res.json({'ok': true});
});

router.get('/talks', function(req, res, next) {
    sqlite3.getPapers(function(papers) {
        res.json(papers);
    });

});


module.exports = router;
