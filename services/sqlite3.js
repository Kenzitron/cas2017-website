const sqlite3 = require('sqlite3').verbose();
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

};

module.exports.insertUser = function(username, password, name) {
    const stmt = db.prepare('INSERT INTO users VALUES (?,?,?,?)');
    stmt.run(null, username, password, name);
    stmt.finalize();
};

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