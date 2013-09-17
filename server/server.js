var io = require('socket.io').listen(8762);
var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database('karishoot.db');

io.sockets.on('connection', function(socket){

    // 新規ユーザー登録
    socket.on('signup', function(data) {
        var inSql = 'INSERT INTO user VALUES("' +
            data.id +'","'+
            data.name+'",'+ // 名前
            1 +','+ // レベル
            3000 +','+ // HP
            10 +','+ // 攻撃力
            10 +','+ // 守備力
            1 +','+ // 素早さ
            0 +','+ // 経験値
            0 + // 射幸心ポイント
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
});
