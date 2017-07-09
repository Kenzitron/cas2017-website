/* Votes structure: { user_id: X, paper_id: X, score: XX } */
module.exports.getScoreTotal = function(votes){   
    let sumaObject = votes.reduce(function (a,b){  
        return { score : a.score + b.score }
    }, {score: 0});
    return sumaObject.score;
}