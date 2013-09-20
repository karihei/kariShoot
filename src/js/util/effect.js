define([], function() {
    kariShoot.util.effect = function() {};

    /**
     * 画面を揺らす
     * @param {number=} opt_time 揺らす時間
     */
    kariShoot.util.effect.shake = function(opt_time) {
        if (!kariShoot.util.effect.shake.isShake_) {
            var time = 100 || opt_time;
            var stageEl = $('#enchant-stage');
            stageEl.jrumble({
                x: 10,
                y: 10,
                rotation: 5,
                speed: 10
            });
            stageEl.trigger('startRumble');
            kariShoot.util.effect.shake.isShake_ = true;

            setTimeout(function() {
                stageEl.trigger('stopRumble');
                kariShoot.util.effect.shake.isShake_ = false;
            }, time);
        }
    };

    /**
     * 画面を揺らしてる最中はtrue
     * @const {boolean}
     * @private
     */
    kariShoot.util.effect.shake.isShake_ = false;
});