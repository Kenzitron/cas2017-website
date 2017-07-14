const sqlite3 = require('../services/sqlite3');

module.exports.getPapers = function(){
    return new Promise((resolve, reject) => {
        try{
            sqlite3.getPapers().then(papers => {
                resolve(papers);
            }).catch( err => {
                reject(err);
            });
        }catch(err){
            reject(err);
        }
    });
};


module.exports.getPapersVotedByUser = (user) => {
    return new Promise((resolve, reject) => {
        try{
            let userId = user && user.id ? user.id : null;
            sqlite3.getAllPapersVotedAndRatesByUserId(userId).then(papers => {
                resolve(papers);
            }).catch( err => {
                reject(err);
            });
        }catch(err){
            reject(err);
        }
    });
};