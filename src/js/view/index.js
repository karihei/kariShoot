/**
 * @fileoverview index.html で実行されるやつ
 */
$(document).ready(function() {
    var loginUser = kariShoot.LOGIN_USER;

    var updateUser = function(user) {
        $('#player-name').text(user.name);
        $('#player-level').text('LV:' + user.level);
        $('#player-exp').text('EXP:' + user.exp);
        $('#player-skp').text('射幸心ポイント:' + user.skp);
        $('#player-hp').text('HP:' + user.hp);
        $('#player-atk').text('ATK:' + user.atk);
        $('#player-def').text('DEF:' + user.def);
        $('#player-agi').text('AGI:' + user.agi);
    };
    updateUser(loginUser);

    kariShoot.socket.on('updateuser result ' + kariShoot.LOGIN_USER.id, function(data) {
        updateUser(data[0]);
    });

});