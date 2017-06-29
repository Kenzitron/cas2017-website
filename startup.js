/**
 * Created by aasensio on 29/06/2017.
 */
var fs = require('fs');
var parse = require('csv-parse');
var sha1 = require('sha1');
var sqlite = require('./services/sqlite3');

sqlite.createTables();

fs.readFile('./bin/users.csv', 'utf8', function(err, content) {
    parse(content, {columns: null, delimiter: ';', trim: true}, function(err, rows) {
        for (var i = 0;i<rows.length;i++){
            sqlite.insertUser(rows[i][3], sha1(rows[i][0]), rows[i][2]);
        }
    })
});

fs.readFile('./bin/C4P-report.csv', 'utf8', function(err, content) {
    parse(content, {columns: null, delimiter: ',', trim: true}, function(err, rows) {
        for (var i = 0;i<rows.length;i++){
            var tags = [
                rows[i][12], rows[i][13],
                rows[i][14], rows[i][15],
                rows[i][16], rows[i][17],
                rows[i][18], rows[i][19],
                rows[i][20], rows[i][21],
                rows[i][22], rows[i][23],rows[i][24]
            ].filter(String);

            sqlite.insertPaper(rows[i][0], rows[i][1], rows[i][2],
                rows[i][3], rows[i][4], rows[i][5],
                rows[i][6], rows[i][7], rows[i][8],
                rows[i][9], rows[i][10],
                rows[i][11], tags.join(","),
                rows[i][25], rows[i][26],
                rows[i][27]
            );
        }
    })
});