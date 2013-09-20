define(['structure/structure'], function() {
    kariShoot.structure.ItemBase = Class.create(PhyCircleSprite, {
        initialize: function(w) {
            PhyCircleSprite.call(this, w, enchant.box2d.DYNAMIC_SPRITE, 0.9, 1.0, 0, false);

            /**
             * 弾が触れても弾の耐久値を減らさない
             * @type {boolean}
             */
            this.bulletTouchable = true;
        },

        /**
         * なんかが衝突した時の処理
         * @param {Sprite}
         */
        hit: function(sprite) {
            this.applyImpulse(new b2Vec2(Math.random() * 2 - 1, -1));
            this.tl.delay(50).fadeOut(10).then(this.destroy)
        }
    });
});