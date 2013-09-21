/**
 * @fileoverview manage以下のクラスをrequireするだけ
 */
define([], function() {
    /**
     * @constractor
     */
    kariShoot.manage = function() {};

    // manage以下にクラスを追加したらここにも追記する
    require(['manage/turn', 'manage/status', 'manage/minimap', 'manage/client', 'manage/message']);
});