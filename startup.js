/**
 * Created by aasensio on 29/06/2017.
 */
const fs = require('fs');
const parse = require('csv-parse');
const sha1 = require('sha1');
const sqlite = require('./services/sqlite3');

sqlite.createTables();

fs.readFile('./bin/users.csv', 'utf8', function(err, content) {
    parse(content, {columns: null, delimiter: ';', trim: true}, function(err, rows) {
        for (let row of rows) {
            sqlite.insertUser(row[3], sha1(row[0]), row[2]);
        }
    })
});

fs.readFile('./bin/C4P-report.csv', 'utf8', function(err, content) {
    parse(content, {columns: null, delimiter: ',', trim: true}, function(err, rows) {
        for (let row of rows) {
            const tags = [
                row[12], row[13], row[14], row[15], row[16], row[17], row[18],
                row[19], row[20], row[21], row[22], row[23], row[24]
            ].filter(String);

            sqlite.insertPaper(
                row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8],
                row[9], row[10], row[11], tags.join(','), row[25], row[26], row[27]
            );
        }
    })
});