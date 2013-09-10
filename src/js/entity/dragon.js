define(['entity/enemy'], function() {
    var IMAGE_PATH = 'img/entity/dragon.png';
    core.preload(IMAGE_PATH);

    kariShoot.Entity.Dragon = Class.create(kariShoot.Entity.Enemy, {
        initialize: function() {
            var status = {
                hp: 3000,
                deffence: 10
            };
            kariShoot.Entity.Enemy.call(this, 128, 128, status, IMAGE_PATH);
            this.account = 0;
            this.name = 'ドラゴン';
        },

        onenterframe: function() {
            kariShoot.Entity.Enemy.prototype.onenterframe.call(this);
            if (this.account++ > (core.fps / 9)) {
                this.frame = this.frameCount++;
                this.account = 0;
            }
        },

        /**
         * @override
         */
        action: function() {
            kariShoot.Entity.prototype.action.call(this);

            this.attack(core.rootScene.player);
            setTimeout($.proxy(function() {
                kariShoot.manage.Turn.getInstance().end();
            }, this), 1000);
        }
    });
});
