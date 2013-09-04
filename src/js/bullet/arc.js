define(['bullet/bullet'], function() {
    /**
     * 指定位置まで直線的に上昇した後、カクっと曲がる弾
     * @constructor
     */
    kariShoot.Bullet.Arc = Class.create(kariShoot.Bullet, {
        initialize: function() {
            kariShoot.Bullet.call(this);

            /**
             * 折り返し地点座標
             * @type {number}
             * @private
             */
            this.midX_

            /**
             * 折り返し地点座標
             * @type {number}
             * @private
             */
            this.midY_

            /**
             * @type {number}
             * @private
             */
            this.speed_ = 12;
        },

        handleShot: function(shooter) {
            this.midX_ = this.vX;
            this.midY_ = this.vY;
            this.applyForce(new b2Vec2(this.speed_, this.calcVec_(this.speed_)));
        },

        /**
         * @override
         */
        handleEnterframe: function() {
            kariShoot.Bullet.prototype.handleEnterframe.call(this);
            if (this.centerX > this.midX_) {
                //this.applyForce(new b2Vec2(this.speed_, this.calcVec_(this.speed_) * -1));
            }
        },

        calcVec_: function(x) {
            var pX = this.centerX;
            var pY = this.centerY;
            var d = (pY - this.vY) / (this.vX - pX);
            return d * x * -1;
        }

    });
});
