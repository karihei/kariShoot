define(['bullet/bullet'], function() {
    /**
     * 重力弾
     * @constructor
     */
    kariShoot.Bullet.Gravity = Class.create(kariShoot.Bullet, {
        initialize: function() {
            kariShoot.Bullet.call(this);

            core.rootScene.addEventListener('touchstart', $.proxy(function() {
                if (this.isMove()) {
                    this.setAwake(false);
                    // this.applyImpulse(new b2Vec2(0, 10));
                }
            }, this));
        }
    });
});
