/**
 * @fileoverview manage以下のクラスをrequireするだけ
 */
define([], function() {
    kariShoot.util = function() {};

    // util以下にクラスを追加したらここにも追記する
    require(['util/canvas', 'util/effect']);
});