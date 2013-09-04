$(document).ready(function() {
    var MAX_COUNT = 4;
    var count = 0;
    var statusBox = $('#status-box');
    var attackPoints = [];

    /**
     * ぶん殴れる箇所
     * @enum {string}
     */
    attackPoint = {
        FACE: '顔面',
        MUNE: '胸',
        MIZOOCHI: 'みぞおち',
        RIGHT_ARM: '右腕',
        LEFT_ARM: '左腕',
        RIGHT_LEG: '右足',
        LEFT_LEG: '左足'
    };

    $('#face').click(function() {
        proceed(attackPoint.FACE);
    });

    $('#mune').click(function() {
        proceed(attackPoint.MUNE);
    });

    $('#mizoochi').click(function() {
        proceed(attackPoint.MIZOOCHI);
    });

    $('#right-arm').click(function() {
        proceed(attackPoint.RIGHT_ARM);
    });

    $('#left-arm').click(function() {
        proceed(attackPoint.LEFT_ARM);
    });

    $('#right-leg').click(function() {
        proceed(attackPoint.RIGHT_LEG);
    });

    $('#left-leg').click(function() {
        proceed(attackPoint.LEFT_LEG);
    });



    /**
     * ぶん殴る箇所を列挙
     * @param {string} text
     */
    function proceed(text) {
        count++;
        if (count >+ MAX_COUNT) {
            finishSelect();
            return;
        }
        statusBox.append($('<div/>').text(text).addClass('status'));
        if (count < MAX_COUNT) {
            statusBox.append($('<div/>').text('↓').addClass('status-arrow'));
        }
    }

    /**
     * これでいいですか的な確認をする
     */
    function finishSelect() {

    }
});