var io = require('socket.io').listen(8762);
var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database('karishoot.db');

io.sockets.on('connection', function(socket){

    // 新規ユーザー登録
    socket.on('signup', function(data) {
        var inSql = 'INSERT INTO user VALUES("' +
            data.id +'","'+
            data.name+'",'+ // name:名前
            1 +','+ // level:レベル
            3000 +','+ // hp:HP
            10 +','+ // atk:攻撃力
            10 +','+ // def:守備力
            1 +','+ // agi:素早さ
            0 +','+ // exp:経験値
            0 + // skp:射幸心ポイント
        ')';
        db.run(inSql);
    });

    /**
     * @param {Object.<number>}
     */
    socket.on('getuser', function(data) {
        var sql = 'SELECT * FROM user WHERE id=' + data.id;
        db.all(sql, function(err, row) {
            socket.emit('getuser result', row);
        });
    });

    socket.on('addskp', function(data) {
        var sql = 'UPDATE user SET skp=skp+' + data.value + ' WHERE id=' + data.id;
        db.run(sql);
    });
});
