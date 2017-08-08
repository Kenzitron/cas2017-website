/**
 * Created by aasensio on 29/06/2017.
 */
const fs = require('fs');
const parse = require('csv-parse');
const sha1 = require('sha1');
const sqlite = require('./services/sqlite3');

let rn = require('random-number');
let gen = rn.generator({
    min:  1
    , max:  10000000
    , integer: true
});

sqlite.createTables();

let content = fs.readFileSync('./bin/users-final.csv', 'utf8');
parse(content, {columns: null, delimiter: ';', trim: true}, function(err, rows) {
    for (let row of rows) {
        let votes = 10;
        let purchaseDate = row[5];
        if (purchaseDate <= '2017-06-30 23:59:59')
            votes += 2;
        else if (purchaseDate <= '2017-07-15 23:59:59')
            votes += 1;

        sqlite.insertUser(row[3], sha1(row[0]), row[2], votes);
    }
});


content = fs.readFileSync('./bin/C4P-report.csv', 'utf8');
parse(content, {columns: null, delimiter: ',', trim: true}, function(err, rows) { 
    for (let row of rows) {
        let img = row[3].split('/').pop();
        let tmp = (row[5].split('/').pop()).trim();

        let twitter = tmp;
        if (tmp.length > 0 )
            twitter = tmp.startsWith('@') ? tmp : "@" + tmp;

        const tags = [
            row[12], row[13], row[14], row[15], row[16], row[17], row[18],
            row[19], row[20], row[21], row[22], row[23], row[24]
        ].filter(String);

        sqlite.insertPaper(
            row[0], row[1], row[2], img, twitter, row[4], row[6], row[7], row[8],
            row[9], row[10], row[11], tags.join(';'), row[25], row[26], row[27], 'es', gen()
        );
    }
    
});



