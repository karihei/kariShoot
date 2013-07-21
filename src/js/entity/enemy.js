define(['entity/entity'], function() {

    kariGolf.Entity.Enemy = Class.create(kariGolf.Entity, {
        initialize: function(width, height, status, imagePath) {
            kariGolf.Entity.call(this, width, height, status, imagePath);

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
            var bullet = new kariGolf.Bullet();
            bullet.position = {x: this.centerX - 100 , y: this.centerY};
            core.rootScene.mainStage.addChild(bullet);

            bullet.shot(entity.x+100, entity.y, this);

        }
    });
});