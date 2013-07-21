define(['entity/entity'], function() {

    kariShoot.Entity.Enemy = Class.create(kariShoot.Entity, {
        initialize: function(width, height, status, imagePath) {
            kariShoot.Entity.call(this, width, height, status, imagePath);

            this.bullet_;

            this.acount = 0;
            this.addEventListener('enterframe', function() {
                if (this.acount++ > core.fps) {
                   // this.attack(core.rootScene.player);
                    this.acount = 0;
                }
            });
        },

        /**
         * 指定したentityに攻撃する
         * @param {Sprite} entity
         */
        attack: function(entity) {
            var bullet = new kariShoot.Bullet();
            bullet.position = {x: this.centerX - 100 , y: this.centerY};
            core.rootScene.mainStage.addChild(bullet);

            bullet.shot(entity.x+100, entity.y, this);

        }
    });
});
