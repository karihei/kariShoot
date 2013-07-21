define(['bullet/bullet'], function() {
    /**
     * 重力弾
     * @constructor
     */
    kariGolf.Bullet.Gravity = Class.create(kariGolf.Bullet, {
        initialize: function() {
            kariGolf.Bullet.call(this);

            core.rootScene.addEventListener('touchstart', $.proxy(function() {
                if (this.isMove()) {
                    this.setAwake(false);
                    // this.applyImpulse(new b2Vec2(0, 10));
                }
            }, this));
        }
    });
});
