const sqlite3 = require('../services/sqlite3');

/* Votes structure: { user_id: X, paper_id: X, score: XX } */
module.exports.getScoreTotal = votes => {
    let sumaObject = votes.reduce(function (a,b){
        return { score : a.score + b.score }
    }, {score: 0});
    return sumaObject.score ;
};

module.exports.getRemainingVotes = (user) => {
    return new Promise((resolve, reject) => {
        try{
            if (user && user.id && user.num_votes) {
                sqlite3.getVotesByUserId(user.id).then(userVotes => {
                    let sumVotes = this.getScoreTotal(userVotes);
                    resolve(user.num_votes - sumVotes);
                }).catch(err => {
                    resolve(0);
                });
            }else{
                resolve(0)
            }
        }catch(err){
            resolve(0);
        }
    });
};

module.exports.getVotesByUserId = userId => {
    return new Promise((resolve, reject) => {
        try{
            sqlite3.getVotesByUserId(userId).then(userVotes => {
                resolve(userVotes);
            }).catch( err => {
                console.log(err);
                reject(err);
            });
        }catch(err){
            reject(err);
        }
    });
};