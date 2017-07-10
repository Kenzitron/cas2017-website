const sqlite3 = require('sqlite3').verbose();
const Promise = require('promise');
db = new sqlite3.Database('./bin/CAS2017-DB');

module.exports.createTables = function() {
    db.run('DROP TABLE IF EXISTS users');
    db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, name TEXT)');
    console.log('La tabla usuarios ha sido correctamente creada');


    db.run('DROP TABLE IF EXISTS papers');
    db.run('CREATE TABLE IF NOT EXISTS papers (id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
        'hash TEXT, ' +
        'name TEXT, ' +
        'about TEXT, ' +
        'picture TEXT, ' +
        'twitter TEXT, ' +
        'email TEXT, ' +
        'linkedin TEXT, ' +
        'web TEXT, ' +
        'title TEXT, ' +
        'short_description TEXT, ' +
        'description TEXT, ' +
        'extra_information TEXT, ' +
        'tags TEXT, ' +
        'public TEXT, ' +
        'duration TEXT, ' +
        'date TEXT)');
    console.log('La tabla papers ha sido correctamente creada');


    db.run("CREATE TABLE IF NOT EXISTS votes (user_id INTEGER," + 
                        "paper_id INTEGER, " +
                        "score INTEGER, " +
                        "PRIMARY KEY(user_id, paper_id), " +
                        "FOREIGN KEY(user_id) REFERENCES users(id), " +
                        "FOREIGN KEY(paper_id) REFERENCES papers(id) " +
                        ")");
    console.log("La tabla votos ha sido correctamente creada");
};



module.exports.insertUser = function(username, password, name) {
    const stmt = db.prepare('INSERT INTO users VALUES (?,?,?,?)');
    stmt.run(null, username, password, name);
    stmt.finalize();
};

module.exports.insertVote = function(userId, paperId, score){
    var stmt = db.prepare("INSERT INTO votes VALUES (?,?,?)");
    stmt.run(userId, paperId, score);
    stmt.finalize();
    return ({ userId: userId, paperId: paperId, score: score});
}

module.exports.updateVote = function(userId, paperId, score){
    var stmt = db.prepare("UPDATE votes set score=? where user_id = ? and paper_id = ?");
    stmt.run(score, userId, paperId );
    stmt.finalize();
    return ({ userId: userId, paperId: paperId, score: score});
}

module.exports.insertPaper = function(hash, name, about, picture, email, twitter, linkedin, web, title,
                                      short_description, description, extra_information, tags, audience, duration,
                                      date) {
    const stmt = db.prepare('INSERT INTO papers VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
    stmt.run(null, hash, name, about, picture, email, twitter, linkedin,
        web, title, short_description, description, extra_information, tags, audience, duration, date);

    stmt.finalize();
};
module.exports.findByUsername = function(username, fn) {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    stmt.bind(username);

    stmt.get(function(err, row) {
        if (err || !row)
            return fn(null, null);

        return fn(null, row);
    });
};

module.exports.getPapers = function(callback) {
    db.all('SELECT * FROM papers', function(err, rows) {
        return callback(rows);
    });
};

module.exports.getVotesByUserId = function(userId){
    return new Promise((resolve, reject) => {
        try{
            db.all("Select * from votes where user_id = " + userId, function(err, rows) {
                resolve(rows);
            });    
        }catch(err){
            reject(err);
        }    
    });
}

module.exports.getVotesByUserAndPaper = function(userId, paperId){  
    return new Promise((resolve, reject) => {
        try{
            db.all("Select * from votes where user_id = " + userId + " and paper_id = " + paperId,  
            function(err, rows) {
                resolve(rows);
            });    
        }catch(err){
            reject(err);
        }        
    });
}