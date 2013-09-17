/**
 * @fileoverview index.html で実行されるやつ
 */
$(document).ready(function() {
    var loginUser = kariShoot.LOGIN_USER;
    $('#player-name').text(loginUser.name);
    $('#player-level').text('LV:' + loginUser.level);
    $('#player-exp').text('EXP:' + loginUser.exp);
    $('#player-skp').text('射幸心ポイント:' + loginUser.skp);
    $('#player-hp').text('HP:' + loginUser.hp);
    $('#player-atk').text('ATK:' + loginUser.atk);
    $('#player-def').text('DEF:' + loginUser.def);
    $('#player-agi').text('AGI:' + loginUser.agi);

});